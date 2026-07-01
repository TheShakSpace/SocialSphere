import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "server", "data", "db.json");

// Ensure data directory and file exist
function ensureDbExists() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        {
          User: [],
          Post: [],
          Comment: [],
          Follow: [],
          Notification: [],
        },
        null,
        2
      )
    );
  }
}

export class JsonDB {
  private static readData(): any {
    ensureDbExists();
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return {
        User: [],
        Post: [],
        Comment: [],
        Follow: [],
        Notification: [],
      };
    }
  }

  private static writeData(data: any) {
    ensureDbExists();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  public static getModel(modelName: string) {
    return new EmulatorModel(modelName);
  }

  public static query(modelName: string): any[] {
    const db = this.readData();
    return db[modelName] || [];
  }

  public static save(modelName: string, records: any[]) {
    const db = this.readData();
    db[modelName] = records;
    this.writeData(db);
  }
}

class QueryBuilder {
  private records: any[];
  private populates: string[] = [];
  private sortCriteria: any = null;
  private limitCount: number | null = null;

  constructor(records: any[]) {
    // Clone records to avoid mutating original database caches
    this.records = JSON.parse(JSON.stringify(records));
  }

  public populate(pathStr: string) {
    this.populates.push(pathStr);
    return this;
  }

  public sort(criteria: any) {
    this.sortCriteria = criteria;
    return this;
  }

  public limit(n: number) {
    this.limitCount = n;
    return this;
  }

  private executePopulateAndSort() {
    let result = [...this.records];

    // Handle Populates
    if (this.populates.length > 0) {
      const allUsers = JsonDB.query("User");
      const allPosts = JsonDB.query("Post");

      result = result.map((item) => {
        const newItem = { ...item };
        this.populates.forEach((popPath) => {
          // If the field is an ID reference, populate it
          if (newItem[popPath] && typeof newItem[popPath] === "string") {
            const matchedUser = allUsers.find((u) => u._id === newItem[popPath]);
            if (matchedUser) {
              const { password, ...userWithoutPassword } = matchedUser;
              newItem[popPath] = userWithoutPassword;
            } else {
              const matchedPost = allPosts.find((p) => p._id === newItem[popPath]);
              if (matchedPost) {
                newItem[popPath] = matchedPost;
              }
            }
          }
          // If the field is an array of IDs (e.g. likes)
          else if (Array.isArray(newItem[popPath])) {
            newItem[popPath] = newItem[popPath].map((id: any) => {
              if (typeof id === "string") {
                const matchedUser = allUsers.find((u) => u._id === id);
                if (matchedUser) {
                  const { password, ...userWithoutPassword } = matchedUser;
                  return userWithoutPassword;
                }
              }
              return id;
            });
          }
        });
        return newItem;
      });
    }

    // Handle Sort
    if (this.sortCriteria) {
      const keys = Object.keys(this.sortCriteria);
      if (keys.length > 0) {
        const key = keys[0];
        const direction = this.sortCriteria[key]; // 1 for asc, -1 for desc
        result.sort((a, b) => {
          const valA = a[key];
          const valB = b[key];
          if (valA === undefined || valB === undefined) return 0;

          if (typeof valA === "string" && typeof valB === "string") {
            return direction === -1 ? valB.localeCompare(valA) : valA.localeCompare(valB);
          }
          if (valA instanceof Date || !isNaN(Date.parse(valA))) {
            const timeA = new Date(valA).getTime();
            const timeB = new Date(valB).getTime();
            return direction === -1 ? timeB - timeA : timeA - timeB;
          }
          return direction === -1 ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
        });
      }
    }

    // Handle Limit
    if (this.limitCount !== null) {
      result = result.slice(0, this.limitCount);
    }

    return result;
  }

  // Promise Compatibility / Thenable
  public then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    const result = this.executePopulateAndSort();
    return Promise.resolve(result).then(onfulfilled, onrejected);
  }

  public async exec() {
    return this.executePopulateAndSort();
  }
}

class EmulatorModel {
  private modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public find(query: any = {}) {
    const all = JsonDB.query(this.modelName);
    const filtered = all.filter((item) => {
      // If the query has $or
      if (query.$or && Array.isArray(query.$or)) {
        // At least one condition must match
        return query.$or.some((subQuery: any) => {
          return Object.keys(subQuery).every((key) => {
            const val = subQuery[key];
            if (val && typeof val === "object" && "$regex" in val) {
              const itemVal = item[key] || "";
              const flags = val.$options || "";
              const regex = new RegExp(val.$regex, flags);
              return regex.test(itemVal);
            }
            return item[key] === val;
          });
        });
      }

      // Standard query matching
      for (const key in query) {
        if (query[key] !== undefined) {
          const val = query[key];
          if (val && typeof val === "object" && "$regex" in val) {
            const itemVal = item[key] || "";
            const flags = val.$options || "";
            const regex = new RegExp(val.$regex, flags);
            if (!regex.test(itemVal)) return false;
          } else if (item[key] !== val) {
            return false;
          }
        }
      }
      return true;
    });
    return new QueryBuilder(filtered);
  }

  public findOne(query: any = {}) {
    const all = JsonDB.query(this.modelName);
    const matched = all.find((item) => {
      for (const key in query) {
        if (query[key] !== undefined) {
          if (item[key] !== query[key]) {
            return false;
          }
        }
      }
      return true;
    });

    if (!matched) {
      return {
        populate: () => ({
          exec: async () => null,
          then: (cb: any) => Promise.resolve(null).then(cb),
        }),
        exec: async () => null,
        then: (cb: any) => Promise.resolve(null).then(cb),
      };
    }

    // Wrap single item in a custom model object with `.save()` method
    const wrapped = this.wrapRecord(matched);
    return {
      populate: (pathStr: string) => {
        const q = new QueryBuilder([matched]).populate(pathStr);
        return {
          exec: async () => {
            const res = await q.exec();
            return res[0] ? this.wrapRecord(res[0]) : null;
          },
          then: (cb: any) => q.exec().then((res) => (res[0] ? this.wrapRecord(res[0]) : null)).then(cb),
        };
      },
      exec: async () => wrapped,
      then: (cb: any) => Promise.resolve(wrapped).then(cb),
    };
  }

  public findById(id: string) {
    return this.findOne({ _id: id });
  }

  public async create(data: any) {
    const all = JsonDB.query(this.modelName);
    const newRecord = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.push(newRecord);
    JsonDB.save(this.modelName, all);
    return this.wrapRecord(newRecord);
  }

  public async findByIdAndUpdate(id: string, update: any, options: any = {}) {
    const all = JsonDB.query(this.modelName);
    const index = all.findIndex((item: any) => item._id === id);
    if (index === -1) return null;

    const current = all[index];
    const updatedRecord = {
      ...current,
      ...(update.$set || update),
      updatedAt: new Date().toISOString(),
    };

    all[index] = updatedRecord;
    JsonDB.save(this.modelName, all);
    return this.wrapRecord(updatedRecord);
  }

  public async findByIdAndDelete(id: string) {
    const all = JsonDB.query(this.modelName);
    const filtered = all.filter((item: any) => item._id !== id);
    JsonDB.save(this.modelName, filtered);
    return { success: true };
  }

  public async deleteOne(query: any = {}) {
    const all = JsonDB.query(this.modelName);
    const index = all.findIndex((item: any) => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      all.splice(index, 1);
      JsonDB.save(this.modelName, all);
    }
    return { deletedCount: index !== -1 ? 1 : 0 };
  }

  public async deleteMany(query: any = {}) {
    const all = JsonDB.query(this.modelName);
    const initialLength = all.length;
    const filtered = all.filter((item: any) => {
      let matchesAll = true;
      for (const key in query) {
        if (item[key] !== query[key]) {
          matchesAll = false;
          break;
        }
      }
      return !matchesAll; // Keep if it does NOT match all query criteria (effectively deletes matched)
    });
    JsonDB.save(this.modelName, filtered);
    return { deletedCount: initialLength - filtered.length };
  }

  public async updateMany(query: any = {}, update: any = {}) {
    const all = JsonDB.query(this.modelName);
    let matchedCount = 0;
    const updated = all.map((item: any) => {
      let matches = true;
      for (const key in query) {
        if (item[key] !== query[key]) matches = false;
      }
      if (matches) {
        matchedCount++;
        return {
          ...item,
          ...(update.$set || update),
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    JsonDB.save(this.modelName, updated);
    return { matchedCount, modifiedCount: matchedCount };
  }

  public async countDocuments(query: any = {}) {
    const all = JsonDB.query(this.modelName);
    const filtered = all.filter((item: any) => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    return filtered.length;
  }

  private wrapRecord(record: any) {
    if (!record) return null;
    const modelName = this.modelName;
    return {
      ...record,
      save: async function () {
        const all = JsonDB.query(modelName);
        const index = all.findIndex((item: any) => item._id === this._id);
        const dataToSave = { ...this };
        // Delete helper methods from saving into the raw JSON database
        delete dataToSave.save;
        delete dataToSave.toObject;
        if (index !== -1) {
          all[index] = dataToSave;
        } else {
          all.push(dataToSave);
        }
        JsonDB.save(modelName, all);
        return this;
      },
      toObject: function () {
        const obj = { ...this };
        delete obj.save;
        delete obj.toObject;
        return obj;
      },
    };
  }
}

export class Repository {
  constructor(model) { this.model = model; }
  create(data) { return this.model.create(data); }
  findById(id) { return this.model.findById(id); }
  findOne(query) { return this.model.findOne(query); }
  find(query, options = {}) { return this.model.find(query).sort(options.sort || { createdAt: -1 }).limit(options.limit || 100); }
  updateById(id, data) { return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
  deleteById(id) { return this.model.findByIdAndDelete(id); }
}

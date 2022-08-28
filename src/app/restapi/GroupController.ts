const root = '/groups';
const core = 'groupCore';

class GroupController {
  init(props: any) {
    const { app } = props;

    // set express app routes here:
    app.get(`${root}`, this.list);
    app.get(`${root}/:id`, this.get);
    app.post(`${root}`, this.create);
    app.put(`${root}/:id`, this.update);
    app.patch(`${root}/:id`, this.update);
    app.delete(`${root}/:id`, this.remove);
  }

  async list(req, res) {
    const { pageSize, page, sortBy, ...params } = req.query || {};
    const result = await req.context[core].list({ params, pagination: { pageSize, page, sortBy } });
    res.json(result);
  }

  async get(req, res) {
    const { id } = req.params || {};
    const result = await req.context[core].getMany({ id: id.split(',') });
    res.json(result);
  }

  async create(req, res) {
    const { params } = req.body || {};
    const result = await req.context[core].create({ params });
    res.json(result);
  }

  async update(req, res) {
    const { id } = req.params || {};
    const { params } = req.body || {};
    const result = await req.context[core].update({ id, params });
    res.json(result);
  }

  async remove(req, res) {
    const { id } = req.params || {};
    const result = await req.context[core].removeMany({ id: id.split(',') });
    res.json(result);
  }
}

export { GroupController };

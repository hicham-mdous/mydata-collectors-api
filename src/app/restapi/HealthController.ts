const root = '';
const core = 'emailMicroserviceCore';

class HealthController {
  init(props: any) {
    const { app } = props;

    // set express app routes here:
    app.get(`${root}/health`, this.health);
  }

  async health(req, res) {
    const result = await req.context[core].health({ ...req.body });
    res.json(result);
  }
}

export { HealthController };

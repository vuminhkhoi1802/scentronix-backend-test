import * as Yup from 'yup';

const ServerSchema = Yup.object().shape({
  url: Yup.string().required().url(),
  priority: Yup.number().required().positive().integer(),
});

export const findServerRequestBodySchema = Yup.array()
  .of(ServerSchema)
  .required();

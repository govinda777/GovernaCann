export default {
  name: 'association',
  title: 'Association',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'cnpj',
      title: 'CNPJ',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
    },
    {
      name: 'primaryColor',
      title: 'Primary Color',
      type: 'string',
    },
  ],
}

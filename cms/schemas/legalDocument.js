export default {
  name: 'legalDocument',
  title: 'Legal Document',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'association',
      title: 'Association',
      type: 'reference',
      to: [{type: 'association'}],
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Bylaw (Estatuto)', value: 'bylaw'},
          {title: 'POP', value: 'pop'},
          {title: 'Contract', value: 'contract'},
        ],
      },
    },
    {
      name: 'file',
      title: 'File',
      type: 'file',
    },
    {
      name: 'hash',
      title: 'Integrity Hash',
      type: 'string',
    },
  ],
}

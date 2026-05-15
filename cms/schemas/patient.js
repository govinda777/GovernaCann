export default {
  name: 'patient',
  title: 'Patient',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'association',
      title: 'Association',
      type: 'reference',
      to: [{type: 'association'}],
      description: 'Used for row-level access control',
      validation: Rule => Rule.required()
    },
    {
      name: 'cpf',
      title: 'CPF',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'medicalHistory',
      title: 'Medical History',
      type: 'text',
    }
  ],
}

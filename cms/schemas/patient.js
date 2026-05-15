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
      name: 'associationId',
      title: 'Association ID',
      type: 'string',
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

export default {
  name: 'prescription',
  title: 'Prescription',
  type: 'document',
  fields: [
    {
      name: 'patient',
      title: 'Patient',
      type: 'reference',
      to: [{type: 'patient'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'association',
      title: 'Association',
      type: 'reference',
      to: [{type: 'association'}],
      description: 'Used for row-level access control to ensure physicians only see prescriptions from their association',
      validation: Rule => Rule.required()
    },
    {
      name: 'physicianId',
      title: 'Physician ID (Privy)',
      type: 'string',
      description: 'Identity managed by Privy, so we store the string ID instead of a Sanity reference',
      validation: Rule => Rule.required()
    },
    {
      name: 'medication',
      title: 'Medication',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'dosage',
      title: 'Dosage',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'issueDate',
      title: 'Issue Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    }
  ],
}

export default {
  name: 'prescription',
  title: 'Prescription',
  type: 'document',
  fields: [
    {
      name: 'patientId',
      title: 'Patient ID',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'associationId',
      title: 'Association ID',
      type: 'string',
      description: 'Used for row-level access control to ensure physicians only see prescriptions from their association',
      validation: Rule => Rule.required()
    },
    {
      name: 'physicianId',
      title: 'Physician ID',
      type: 'string',
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

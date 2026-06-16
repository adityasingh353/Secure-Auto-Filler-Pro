export type FieldType = 'text' | 'date' | 'select' | 'email' | 'tel' | 'number' | 'file';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  width?: 'full' | 'half';
  accept?: string; // For file inputs
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export const profileSections: FormSection[] = [
  {
    id: 'personal',
    title: '1. Personal Details',
    fields: [
      { name: 'photoUpload', label: 'Upload Passport Photo', type: 'file', accept: 'image/*', width: 'half' },
      { name: 'signUpload', label: 'Upload Signature', type: 'file', accept: 'image/*', width: 'half' },
      { name: 'fullName', label: 'Full Name (as per 10th certificate)', type: 'text', width: 'full' },
      { name: 'fatherName', label: "Father's Name", type: 'text', width: 'half' },
      { name: 'motherName', label: "Mother's Name", type: 'text', width: 'half' },
      { name: 'dob', label: 'Date of Birth', type: 'date', width: 'half' },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Select', 'Male', 'Female', 'Transgender'], width: 'half' },
      { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Select', 'Unmarried', 'Married', 'Divorced', 'Widowed'], width: 'half' },
      { name: 'nationality', label: 'Nationality', type: 'text', placeholder: 'e.g. Indian', width: 'half' },
      { name: 'religion', label: 'Religion', type: 'text', width: 'half' }
    ]
  },
  {
    id: 'contact',
    title: '2. Contact Information',
    fields: [
      { name: 'mobile', label: 'Mobile Number', type: 'tel', width: 'half' },
      { name: 'altMobile', label: 'Alternate Mobile Number', type: 'tel', width: 'half' },
      { name: 'email', label: 'Email ID', type: 'email', width: 'full' }
    ]
  },
  {
    id: 'address',
    title: '3. Address Details',
    fields: [
      { name: 'permHouseNo', label: 'Permanent: House Number', type: 'text', width: 'half' },
      { name: 'permVillage', label: 'Permanent: Village/Town/City', type: 'text', width: 'half' },
      { name: 'permDistrict', label: 'Permanent: District', type: 'text', width: 'half' },
      { name: 'permState', label: 'Permanent: State', type: 'text', width: 'half' },
      { name: 'permPin', label: 'Permanent: PIN Code', type: 'number', width: 'half' },
      { name: 'sameAsPerm', label: 'Correspondence Address same as Permanent?', type: 'select', options: ['Yes', 'No'], width: 'half' },
      { name: 'corrHouseNo', label: 'Corr: House Number', type: 'text', width: 'half' },
      { name: 'corrVillage', label: 'Corr: Village/Town/City', type: 'text', width: 'half' },
      { name: 'corrDistrict', label: 'Corr: District', type: 'text', width: 'half' },
      { name: 'corrState', label: 'Corr: State', type: 'text', width: 'half' },
      { name: 'corrPin', label: 'Corr: PIN Code', type: 'number', width: 'half' }
    ]
  },
  {
    id: 'identity',
    title: '4. Identity Proof',
    fields: [
      { name: 'aadhaarDoc', label: 'Upload Aadhaar Card', type: 'file', accept: '.pdf,image/*', width: 'full' },
      { name: 'aadhaar', label: 'Aadhaar Card Number', type: 'text', width: 'half' },
      { name: 'panDoc', label: 'Upload PAN Card', type: 'file', accept: '.pdf,image/*', width: 'full' },
      { name: 'pan', label: 'PAN Number', type: 'text', width: 'half' },
      { name: 'passport', label: 'Passport Number', type: 'text', width: 'half' },
      { name: 'voterId', label: 'Voter ID Number', type: 'text', width: 'half' },
      { name: 'drivingLicense', label: 'Driving License Number', type: 'text', width: 'half' }
    ]
  },
  {
    id: 'education10',
    title: '5. 10th Details',
    fields: [
      { name: 'tenthDoc', label: 'Upload 10th Marksheet/Certificate', type: 'file', accept: '.pdf,image/*', width: 'full' },
      { name: 'tenthBoard', label: 'Board Name', type: 'text', width: 'full' },
      { name: 'tenthYear', label: 'Passing Year', type: 'number', width: 'half' },
      { name: 'tenthPercentage', label: 'Percentage/CGPA', type: 'text', width: 'half' },
      { name: 'tenthRollNo', label: 'Roll Number', type: 'text', width: 'half' }
    ]
  },
  {
    id: 'education12',
    title: '6. 12th Details',
    fields: [
      { name: 'twelfthDoc', label: 'Upload 12th Marksheet/Certificate', type: 'file', accept: '.pdf,image/*', width: 'full' },
      { name: 'twelfthBoard', label: 'Board Name', type: 'text', width: 'full' },
      { name: 'twelfthYear', label: 'Passing Year', type: 'number', width: 'half' },
      { name: 'twelfthPercentage', label: 'Percentage/CGPA', type: 'text', width: 'half' },
      { name: 'twelfthRollNo', label: 'Roll Number', type: 'text', width: 'half' }
    ]
  },
  {
    id: 'graduation',
    title: '8. Graduation Details',
    fields: [
      { name: 'gradDoc', label: 'Upload Graduation Degree/Marksheet', type: 'file', accept: '.pdf,image/*', width: 'full' },
      { name: 'gradDegree', label: 'Degree (e.g. B.Tech)', type: 'text', width: 'half' },
      { name: 'gradBranch', label: 'Branch (e.g. CSE)', type: 'text', width: 'half' },
      { name: 'gradUniversity', label: 'University/Institution', type: 'text', width: 'full' },
      { name: 'gradYear', label: 'Passing Year', type: 'number', width: 'half' },
      { name: 'gradPercentage', label: 'Percentage/CGPA', type: 'text', width: 'half' }
    ]
  },
  {
    id: 'experience',
    title: '10. Experience Details',
    fields: [
      { name: 'expDoc', label: 'Upload Experience Certificate', type: 'file', accept: '.pdf,image/*', width: 'full' },
      { name: 'expOrg', label: 'Organization Name', type: 'text', width: 'full' },
      { name: 'expDesignation', label: 'Designation', type: 'text', width: 'half' },
      { name: 'expNature', label: 'Nature of Employment', type: 'select', options: ['Permanent', 'Contract', 'Temporary'], width: 'half' },
      { name: 'expStartDate', label: 'Start Date', type: 'date', width: 'half' },
      { name: 'expEndDate', label: 'End Date', type: 'date', width: 'half' }
    ]
  },
  {
    id: 'reservation',
    title: '11. Category & Reservation Details',
    fields: [
      { name: 'categoryDoc', label: 'Upload Category/Reservation Certificate', type: 'file', accept: '.pdf,image/*', width: 'full' },
      { name: 'category', label: 'Category', type: 'select', options: ['General', 'OBC', 'EWS', 'SC', 'ST'], width: 'half' },
      { name: 'subCategory', label: 'Sub-category', type: 'select', options: ['None', 'PwBD', 'Ex-serviceman', 'Sports quota', 'Freedom fighter'], width: 'half' },
      { name: 'certNumber', label: 'Certificate Number (OBC/EWS/SC/ST)', type: 'text', width: 'half' },
      { name: 'certIssueDate', label: 'Issue Date', type: 'date', width: 'half' },
      { name: 'certAuthority', label: 'Issuing Authority', type: 'text', width: 'half' },
      { name: 'pwdType', label: 'PwBD Disability Type', type: 'text', width: 'half' },
      { name: 'pwdPercentage', label: 'Percentage of Disability', type: 'number', width: 'half' }
    ]
  },
  {
    id: 'language',
    title: '12. Language Proficiency',
    fields: [
      { name: 'lang1', label: 'Language 1', type: 'text', width: 'half' },
      { name: 'lang1Prof', label: 'Proficiency', type: 'select', options: ['Read, Write, Speak', 'Read, Write', 'Speak Only'], width: 'half' },
      { name: 'lang2', label: 'Language 2', type: 'text', width: 'half' },
      { name: 'lang2Prof', label: 'Proficiency', type: 'select', options: ['Read, Write, Speak', 'Read, Write', 'Speak Only'], width: 'half' }
    ]
  },
  {
    id: 'preferences',
    title: '14. Examination Centre Preferences',
    fields: [
      { name: 'centre1', label: 'Centre Preference 1', type: 'text', width: 'full' },
      { name: 'centre2', label: 'Centre Preference 2', type: 'text', width: 'full' },
      { name: 'centre3', label: 'Centre Preference 3', type: 'text', width: 'full' }
    ]
  },
  {
    id: 'physical',
    title: '15. Physical Standards & Marks',
    fields: [
      { name: 'height', label: 'Height (cm)', type: 'number', width: 'half' },
      { name: 'weight', label: 'Weight (kg)', type: 'number', width: 'half' },
      { name: 'chest', label: 'Chest Measurement (cm)', type: 'number', width: 'half' },
      { name: 'idMark1', label: 'Identification Mark 1', type: 'text', width: 'full' },
      { name: 'idMark2', label: 'Identification Mark 2', type: 'text', width: 'full' }
    ]
  },
  {
    id: 'bank',
    title: '17. Bank Details',
    fields: [
      { name: 'bankName', label: 'Bank Name', type: 'text', width: 'half' },
      { name: 'accHolder', label: 'Account Holder Name', type: 'text', width: 'half' },
      { name: 'accNumber', label: 'Account Number', type: 'text', width: 'half' },
      { name: 'ifscCode', label: 'IFSC Code', type: 'text', width: 'half' }
    ]
  }
];

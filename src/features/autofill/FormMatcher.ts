export const FIELD_PATTERNS: Record<string, RegExp[]> = {
  // Personal
  fullName: [/name/i, /candidate.*name/i, /full.*name/i, /applicant.*name/i, /first.*name/i],
  fatherName: [/father.*name/i, /guardian.*name/i],
  motherName: [/mother.*name/i],
  dob: [/dob/i, /date.*of.*birth/i, /birth.*date/i, /bdate/i],
  gender: [/gender/i, /sex/i],
  maritalStatus: [/marital/i, /civil.*status/i],
  nationality: [/nationality/i, /citizen/i],
  religion: [/religion/i],
  
  // Contact
  mobile: [/mobile/i, /phone/i, /contact/i, /cell/i],
  altMobile: [/alt.*mobile/i, /alt.*phone/i],
  email: [/email/i, /e-mail/i],
  
  // Address
  permHouseNo: [/house.*no/i, /flat.*no/i, /door.*no/i],
  permVillage: [/village/i, /town/i, /city/i],
  permDistrict: [/district/i, /dist/i],
  permState: [/state/i],
  permPin: [/pin/i, /postal.*code/i, /zip/i],
  
  // Identity
  aadhaar: [/aadhaar/i, /aadhar/i, /uidai/i],
  pan: [/pan.*no/i, /pan.*number/i, /permanent.*account/i],
  passport: [/passport/i],
  voterId: [/voter/i, /epic/i],
  drivingLicense: [/driving.*license/i, /dl.*no/i],
  
  // Education
  tenthBoard: [/10th.*board/i, /ssc.*board/i, /matric.*board/i, /board.*university/i],
  tenthYear: [/10th.*year/i, /ssc.*year/i, /passing.*year/i],
  tenthPercentage: [/10th.*%/i, /10th.*percentage/i, /ssc.*percentage/i, /marks.*obtained/i],
  twelfthBoard: [/12th.*board/i, /hsc.*board/i, /intermediate.*board/i],
  twelfthYear: [/12th.*year/i, /hsc.*year/i],
  twelfthPercentage: [/12th.*%/i, /12th.*percentage/i],
  
  gradDegree: [/degree/i, /graduation/i],
  gradBranch: [/branch/i, /discipline/i],
  
  // Category
  category: [/category/i, /caste/i, /community/i],
  subCategory: [/sub.*category/i],
  
  // Bank
  bankName: [/bank.*name/i],
  accNumber: [/account.*no/i, /acc.*no/i],
  ifscCode: [/ifsc/i]
};

/**
 * Analyzes an HTML element and returns the profile configuration key it most likely matches.
 */
export const analyzeField = (element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string | null => {
  let bestMatch: string | null = null;
  let highestScore = 0;

  for (const [key, patterns] of Object.entries(FIELD_PATTERNS)) {
    let score = 0;
    
    // Check attributes
    const nameIdContext = `${element.id} ${element.name}`;
    if (patterns.some(p => p.test(nameIdContext))) score += 40;
    
    // Check label/placeholder
    const placeholder = element.tagName !== 'SELECT' ? (element as HTMLInputElement).placeholder : '';
    const visualContext = `${findLabelFor(element)} ${placeholder} ${element.getAttribute('aria-label')}`;
    if (patterns.some(p => p.test(visualContext))) score += 60;

    if (score > highestScore && score >= 40) { // Threshold
      highestScore = score;
      bestMatch = key;
    }
  }

  return bestMatch;
};

const findLabelFor = (element: HTMLElement): string | null => {
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent;
  }
  
  const wrapper = element.closest('label');
  if (wrapper) return wrapper.textContent;
  
  // Preceding sibling heuristics
  const prev = element.previousElementSibling;
  if (prev && prev.tagName !== 'INPUT' && prev.textContent) {
    if (prev.textContent.trim().length < 50) {
      return prev.textContent;
    }
  }

  return null;
};

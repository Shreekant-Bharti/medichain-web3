// Contract ABIs - Essential functions only for frontend
export const PATIENT_NFT_ABI = [
  "function mintPatientNFT(address patient, string encryptedIPFSHash) returns (uint256)",
  "function grantAccess(uint256 tokenId, address grantee, uint8 level)",
  "function revokeAccess(uint256 tokenId, address revokee)",
  "function updateMedicalRecord(uint256 tokenId, string newEncryptedIPFSHash)",
  "function emergencyAccess(uint256 tokenId, string reason)",
  "function accessRecord(uint256 tokenId) returns (tuple(string encryptedIPFSHash, uint256 lastUpdated, address patient, bool isActive, uint256 emergencyAccessCount))",
  "function getPatientData(uint256 tokenId) view returns (tuple(string encryptedIPFSHash, uint256 lastUpdated, address patient, bool isActive, uint256 emergencyAccessCount))",
  "function getAccessHistory(uint256 tokenId) view returns (tuple(address accessor, uint256 timestamp, string reason, bool isEmergency)[])",
  "function checkPermission(uint256 tokenId, address user) view returns (uint8)",
  "function getPatientTokenId(address patient) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "event PatientNFTMinted(uint256 indexed tokenId, address indexed patient, string encryptedIPFSHash, uint256 timestamp)",
  "event AccessGranted(uint256 indexed tokenId, address indexed grantee, uint8 level, address indexed grantor, uint256 timestamp)",
  "event MedicalRecordUpdated(uint256 indexed tokenId, string newEncryptedIPFSHash, address indexed updater, uint256 timestamp)",
] as const;

export const DOCTOR_REGISTRY_ABI = [
  "function registerDoctor(address doctorAddress, string name, string licenseNumber, uint8 specialization, string credentialHash, string institution, uint256 yearsOfExperience)",
  "function verifyDoctor(address doctorAddress, string remarks)",
  "function isVerifiedDoctor(address doctorAddress) view returns (bool)",
  "function getDoctor(address doctorAddress) view returns (tuple(address doctorAddress, string name, string licenseNumber, uint8 specialization, string credentialHash, uint256 registrationDate, uint256 verificationDate, uint8 status, address verifiedBy, string institution, uint256 yearsOfExperience, bool isActive))",
  "function getAllDoctors() view returns (address[])",
  "function getVerifiedDoctorsCount() view returns (uint256)",
  "function getPrescriptionCount(address doctorAddress) view returns (uint256)",
  "event DoctorRegistered(address indexed doctorAddress, string name, string licenseNumber, uint8 specialization, uint256 timestamp)",
  "event DoctorVerified(address indexed doctorAddress, address indexed verifier, uint256 timestamp)",
] as const;

export const PRESCRIPTION_CONTRACT_ABI = [
  "function issuePrescription(uint256 patientTokenId, address patientAddress, string medicineHash, uint8 category, uint256 validityPeriod, string notes, uint256 refillsAllowed) returns (uint256)",
  "function verifyPrescription(uint256 prescriptionId) view returns (bool isValid, tuple(uint256 prescriptionId, address doctorAddress, uint256 patientTokenId, address patientAddress, string medicineHash, uint8 category, uint256 issuedTimestamp, uint256 validityPeriod, uint256 expiryTimestamp, bool isDispensed, address dispensedBy, uint256 dispensedTimestamp, uint8 status, string notes, uint256 refillsAllowed, uint256 refillsUsed) prescription)",
  "function checkValidity(uint256 prescriptionId) view returns (bool)",
  "function dispenseMedicine(uint256 prescriptionId, string batchNumber, uint256 quantity, string pharmacyNotes)",
  "function cancelPrescription(uint256 prescriptionId, string reason)",
  "function getPrescription(uint256 prescriptionId) view returns (tuple(uint256 prescriptionId, address doctorAddress, uint256 patientTokenId, address patientAddress, string medicineHash, uint8 category, uint256 issuedTimestamp, uint256 validityPeriod, uint256 expiryTimestamp, bool isDispensed, address dispensedBy, uint256 dispensedTimestamp, uint8 status, string notes, uint256 refillsAllowed, uint256 refillsUsed))",
  "function getPatientPrescriptions(address patientAddress) view returns (uint256[])",
  "function getDoctorPrescriptions(address doctorAddress) view returns (uint256[])",
  "function getDispensingHistory(uint256 prescriptionId) view returns (tuple(uint256 prescriptionId, address pharmacy, uint256 timestamp, string batchNumber, uint256 quantity, string pharmacyNotes)[])",
  "function getTotalPrescriptions() view returns (uint256)",
  "event PrescriptionIssued(uint256 indexed prescriptionId, address indexed doctor, uint256 indexed patientTokenId, address patientAddress, string medicineHash, uint256 validityPeriod, uint256 timestamp)",
  "event MedicineDispensed(uint256 indexed prescriptionId, address indexed pharmacy, address indexed patient, uint256 timestamp, string batchNumber)",
] as const;

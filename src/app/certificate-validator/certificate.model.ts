export interface Certificate {
  code: string;
holderName: string;
issueDate: Date;
expirationDate?: Date;
issuer: string;
course?: string;
status: 'valid' | 'expired' | 'revoked' | 'not-found';
}

export interface ValidationResult {
isValid: boolean;
certificate?: Certificate;
message: string;
errors?: string[];
}

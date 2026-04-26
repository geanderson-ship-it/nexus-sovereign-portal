
export const ADMIN_EMAILS = [
    'geanderson@nexustreinamento.com', 
    'geanderson@nexustreinamento',
    'geandersonleo@gmail.com', 
    'geandersonleo@gmail'
];

export const isAdminUser = (user: any): boolean => {
    if (!user) return false;
    
    // Check all possible places where the email might be stored in the AWS Cognito user object
    const emailsToCheck = [
        user.email,
        user.attributes?.email,
        user.signInDetails?.loginId,
        user.username
    ].map(e => (e || '').trim().toLowerCase()).filter(Boolean);

    return emailsToCheck.some(email => ADMIN_EMAILS.includes(email));
};

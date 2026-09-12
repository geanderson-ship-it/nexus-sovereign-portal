export type UserLevel = 'ADMIN' | 'SALES' | 'USER' | 'DEVELOPER' | 'SUPPORT';

export const ADMIN_EMAILS = [
    'geanderson@nexusholdinggroup.com.br',
    'geandersonleo@gmail.com',
    'ivonisevero4@gmail.com',
];

// Nível 3: Exclusivo Fundadores & Diretoria Executiva (Gean & Ivoni)
export const FOUNDER_DIRECTOR_EMAILS = [
    'geanderson@nexusholdinggroup.com.br',
    'geandersonleo@gmail.com',
    'ivonisevero4@gmail.com',
];

// Futuros níveis de acesso delegados (Desenvolvedores / Suporte Técnico)
export const DEVELOPER_SUPPORT_EMAILS: string[] = [];

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

export const canAccessNexusCode = (user: any): boolean => {
    if (!user) return false;

    const emailsToCheck = [
        user.email,
        user.attributes?.email,
        user.signInDetails?.loginId,
        user.username
    ].map(e => (e || '').trim().toLowerCase()).filter(Boolean);

    return emailsToCheck.some(email => 
        FOUNDER_DIRECTOR_EMAILS.includes(email) || 
        DEVELOPER_SUPPORT_EMAILS.includes(email)
    );
};

export type Contract = {
    parties: string[];
    obligations: Record<string, string[]>;
    termination_clauses: string[];
    important_dates: {
        date: string; // ISO date format: YYYY-MM-DD
        description: string;
    }[];
    risks: string[];
    payment_terms: {
        amount: string;
        schedule: string;
        method: string;
        penalties: string;
    };
    contract_type: string;
    duration: string;
    text_analysis: string;
};


export type  Party = {
    name: string;
    role: string;
    contact_info: string | null;
}

export type  KeyTerms = {
    scope_of_work: string | null;
    deliverables: string[];
    territory: string | null;
}

export type  PaymentTerms = {
    amount: string | null;
    currency: string | null;
    schedule: string | null;
    method: string | null;
    invoicing: string | null;
    penalties: string | null;
    expenses: string | null;
}

export type  ImportantDate = {
    date: string;
    description: string;
    type: string;
}

export type  TerminationClause = {
    type: string;
    notice_period: string | null;
    conditions: string;
}

export type  Confidentiality = {
    applies: boolean;
    duration: string | null;
    scope: string | null;
}

export type  IntellectualProperty = {
    ownership: string | null;
    licenses: string | null;
    restrictions: string | null;
}

export type  LiabilityAndIndemnification = {
    liability_cap: string | null;
    indemnification: string | null;
    insurance: string | null;
}

export type  DisputeResolution = {
    method: string | null;
    jurisdiction: string | null;
    governing_law: string | null;
}

export type  SpecialClause = {
    title: string;
    description: string;
}

export type  Risk = {
    category: string;
    description: string;
    severity: string;
    mitigation: string | null;
}



export type  ContractAnalysis = {
  contract_type: string;
  parties: {
    name: string;
    role: string;
    contact_info: string;
  }[];
  effective_date: string;
  duration: string;
  key_terms: {
    scope_of_work: string;
    deliverables: string[];
    territory: string;
  };
  obligations: Record<string, string[]>;
  payment_terms: {
    amount: number | null;
    currency: string | null;
    schedule: string | null;
    method: string | null;
    invoicing: string | null;
    penalties: string | null;
    expenses: string | null;
  };
  important_dates: {
    date: string;
    description: string;
    type: "milestone" | "deadline" | "termination" | string;
  }[];
  termination_clauses: {
    type: string;
    notice_period: string | null;
    conditions: string | null;
  }[];
  renewal_terms: string | null;
  confidentiality: {
    applies: boolean;
    duration: string | null;
    scope: string | null;
  };
  intellectual_property: {
    ownership: string | null;
    licenses: string | null;
    restrictions: string | null;
  };
  liability_and_indemnification: {
    liability_cap: string | null;
    indemnification: string | null;
    insurance: string | null;
  };
  warranties_and_representations: string[];
  dispute_resolution: {
    method: string | null;
    jurisdiction: string | null;
    governing_law: string | null;
  };
  special_clauses: {
    title: string;
    description: string;
  }[];
  risks: {
    category: string;
    description: string;
    severity: "low" | "medium" | "high" | string;
    mitigation: string;
  }[];
  compliance_requirements: string[];
  amendments: string | null;
  notices: string;
  missing_elements: string[];
  red_flags: string[];
  text_analysis: string;
};

export interface OperatorInfo {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  email: string;
  phone?: string;
}

/**
 * Placeholder values. Must be filled in with the real, accurate operator
 * details (Impressumspflicht, § 5 DDG) before this site goes live publicly.
 * The banner in OperatorInfoWarning stays visible across the whole app
 * until every value below is replaced.
 */
export const OPERATOR_INFO: OperatorInfo = {
  name: "TODO Name",
  street: "TODO Straße und Hausnummer",
  postalCode: "TODO PLZ",
  city: "TODO Ort",
  email: "TODO@example.com",
  phone: "",
};

export function isOperatorInfoComplete(info: OperatorInfo = OPERATOR_INFO): boolean {
  const required = [info.name, info.street, info.postalCode, info.city, info.email];
  return required.every((value) => value.trim().length > 0 && !value.includes("TODO"));
}

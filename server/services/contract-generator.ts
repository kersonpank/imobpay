import OpenAI from "openai";
import fs from "fs";
import path from "path";

// Inicializar cliente OpenAI
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Ler template de contrato
function readContractTemplate(): string {
  const templatePath = path.resolve(
    import.meta.dirname,
    "..",
    "..",
    "shared",
    "contract-template.md"
  );
  
  try {
    return fs.readFileSync(templatePath, "utf-8");
  } catch (error) {
    console.error("Erro ao ler template de contrato:", error);
    throw new Error("Template de contrato não encontrado");
  }
}

// Substituir placeholders simples no template
function replacePlaceholders(template: string, data: Record<string, any>): string {
  let result = template;

  // Substituir placeholders simples {{VARIAVEL}}
  Object.keys(data).forEach((key) => {
    const value = data[key] || "";
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, String(value));
  });

  // Processar condicionais {{#SE_TEM_FIADOR}} ... {{/SE_TEM_FIADOR}}
  result = result.replace(/\{\{#SE_TEM_FIADOR\}\}([\s\S]*?)\{\{\/SE_TEM_FIADOR\}\}/g, (match, content) => {
    return data.SE_TEM_FIADOR ? content : "";
  });

  // Processar condicionais de garantia
  const guaranteeType = data.GARANTIA_TIPO?.toLowerCase();
  result = result.replace(/\{\{#GARANTIA_(\w+)\}\}([\s\S]*?)\{\{\/GARANTIA_\w+\}\}/g, (match, type, content) => {
    return guaranteeType === type.toLowerCase() ? content : "";
  });

  return result;
}

// Formatar número por extenso (função auxiliar básica)
function numberToWords(value: number): string {
  const units = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const teens = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const tens = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const hundreds = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  if (value === 0) return units[0];

  // Simplificado para números até 999
  const reais = Math.floor(value);
  const centavos = Math.round((value - reais) * 100);

  let result = "";
  
  if (reais >= 100) {
    const hundred = Math.floor(reais / 100);
    result += hundreds[hundred] + " ";
    const remainder = reais % 100;
    if (remainder > 0) {
      if (remainder < 20) {
        result += teens[remainder - 10] + " ";
      } else {
        const ten = Math.floor(remainder / 10);
        const unit = remainder % 10;
        result += tens[ten];
        if (unit > 0) result += " e " + units[unit];
        result += " ";
      }
    }
  } else if (reais >= 20) {
    const ten = Math.floor(reais / 10);
    const unit = reais % 10;
    result += tens[ten];
    if (unit > 0) result += " e " + units[unit];
    result += " ";
  } else if (reais >= 10) {
    result += teens[reais - 10] + " ";
  } else if (reais > 0) {
    result += units[reais] + " ";
  }

  result += "reais";
  if (centavos > 0) {
    result += " e " + numberToWords(centavos) + " centavos";
  }

  return result.trim();
}

// Preparar dados para o template
export interface ContractData {
  // Locador
  landlordName: string;
  landlordCpf: string;
  landlordAddress: string;
  landlordCity?: string;
  landlordState?: string;

  // Locatário
  tenantName: string;
  tenantCpf: string;
  tenantAddress: string;
  tenantStateCivil?: string;
  tenantProfession?: string;

  // Fiador (opcional)
  guarantorName?: string;
  guarantorCpf?: string;
  guarantorAddress?: string;

  // Imóvel
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZipcode: string;
  propertyDescription: string;

  // Contrato
  monthlyRent: number;
  dueDay: number;
  startDate: Date;
  endDate: Date;
  periodMonths: number;
  adjustmentIndex?: string; // IPCA, IGP-M, etc.

  // Garantia
  guaranteeType: "fiador" | "caucao" | "seguro" | "nenhuma";
  guaranteeDetails?: any;

  // Outros
  lateFeePercent?: number;
  interestPercent?: number;
  cancellationFee?: string;
  iptuResponsible?: string;
  utilitiesResponsible?: string;
  condominiumResponsible?: string;
  taxesResponsible?: string;
  jurisdiction?: string;
}

// Gerar contrato usando IA
export async function generateContractWithAI(
  contractData: ContractData
): Promise<{ contractText: string; metadata: any }> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY não configurada. Configure a variável de ambiente.");
  }

  const template = readContractTemplate();
  
  // Preparar dados formatados para substituição
  const formattedData = {
    // Locador
    LOCADOR_NOME: contractData.landlordName,
    LOCADOR_CPF: contractData.landlordCpf,
    LOCADOR_ENDERECO: contractData.landlordAddress,
    LOCADOR_CIDADE: contractData.landlordCity || "",
    LOCADOR_ESTADO: contractData.landlordState || "",

    // Locatário
    LOCATARIO_NOME: contractData.tenantName,
    LOCATARIO_CPF: contractData.tenantCpf,
    LOCATARIO_ENDERECO: contractData.tenantAddress,
    LOCATARIO_ESTADO_CIVIL: contractData.tenantStateCivil || "",
    LOCATARIO_PROFISSAO: contractData.tenantProfession || "",

    // Fiador
    SE_TEM_FIADOR: !!contractData.guarantorName,
    FIADOR_NOME: contractData.guarantorName || "",
    FIADOR_CPF: contractData.guarantorCpf || "",
    FIADOR_ENDERECO: contractData.guarantorAddress || "",

    // Imóvel
    IMOVEL_ENDERECO: contractData.propertyAddress,
    IMOVEL_CIDADE: contractData.propertyCity,
    IMOVEL_ESTADO: contractData.propertyState,
    IMOVEL_CEP: contractData.propertyZipcode,
    IMOVEL_DESCRICAO: contractData.propertyDescription,

    // Valores
    ALUGUEL_VALOR: contractData.monthlyRent.toFixed(2).replace(".", ","),
    ALUGUEL_VALOR_EXTENSO: numberToWords(contractData.monthlyRent),
    VENCIMENTO_DIA: contractData.dueDay,
    PERIODO_MES: contractData.periodMonths,
    DATA_INICIO: contractData.startDate.toLocaleDateString("pt-BR"),
    DATA_TERMINO: contractData.endDate.toLocaleDateString("pt-BR"),

    // Reajuste
    REAJUSTE_INDICE: contractData.adjustmentIndex || "IPCA",
    REAJUSTE_DESCRICAO: contractData.adjustmentIndex === "IPCA" 
      ? "Índice Nacional de Preços ao Consumidor Amplo"
      : contractData.adjustmentIndex === "IGP-M"
      ? "Índice Geral de Preços do Mercado"
      : contractData.adjustmentIndex || "IPCA",
    DATA_PRIMEIRO_REAJUSTE: new Date(
      contractData.startDate.getFullYear() + 1,
      contractData.startDate.getMonth(),
      contractData.startDate.getDate()
    ).toLocaleDateString("pt-BR"),

    // Garantia
    GARANTIA_TIPO: contractData.guaranteeType === "fiador" ? "Fiador" :
                   contractData.guaranteeType === "caucao" ? "Caução" :
                   contractData.guaranteeType === "seguro" ? "Seguro-Fiança" :
                   "Sem Garantia",
    CAUCAO_VALOR: contractData.guaranteeType === "caucao" && contractData.guaranteeDetails?.value
      ? contractData.guaranteeDetails.value.toFixed(2).replace(".", ",")
      : "",
    CAUCAO_VALOR_EXTENSO: contractData.guaranteeType === "caucao" && contractData.guaranteeDetails?.value
      ? numberToWords(contractData.guaranteeDetails.value)
      : "",
    CAUCAO_MESES: contractData.guaranteeType === "caucao" && contractData.guaranteeDetails?.months
      ? contractData.guaranteeDetails.months
      : "",

    // Multas e encargos
    MULTA_PERCENTUAL: contractData.lateFeePercent || "2",
    JUROS_PERCENTUAL: contractData.interestPercent || "1",
    MULTA_RESCISAO: contractData.cancellationFee || "multa proporcional ao tempo restante",

    // Responsabilidades
    RESPONSAVEL_IPTU: contractData.iptuResponsible || "LOCADOR",
    RESPONSAVEL_UTILIDADES: contractData.utilitiesResponsible || "LOCATÁRIO",
    RESPONSAVEL_CONDOMINIO: contractData.condominiumResponsible || "LOCATÁRIO",
    RESPONSAVEL_TAXAS: contractData.taxesResponsible || "LOCATÁRIO",

    // Outros
    FORMA_PAGAMENTO: "link de pagamento ou boleto bancário",
    FORO: contractData.jurisdiction || contractData.propertyCity || "Comarca de origem do imóvel",
    DATA_CONTRATO: new Date().toLocaleDateString("pt-BR"),
  };

  // Substituir placeholders básicos
  const preProcessedTemplate = replacePlaceholders(template, formattedData);

  // System prompt para OpenAI
  const systemPrompt = `Você é um gerador de contratos de locação residencial em língua portuguesa brasileira. 
Sua função é receber um template de contrato com placeholders já parcialmente preenchidos e gerar um contrato formal, 
claro e objetivo, usando linguagem acessível mas profissional.

Requisitos:
- Manter todas as informações preenchidas no template
- Usar linguagem jurídica adequada mas acessível
- Garantir que todas as cláusulas estejam completas e coerentes
- Incluir todos os elementos obrigatórios de um contrato de locação
- Retornar APENAS o texto do contrato, sem explicações ou metadados adicionais
- Formatar adequadamente com quebras de linha e estrutura clara
- Garantir que valores monetários estejam no formato brasileiro (R$ X.XXX,XX)`;

  // User prompt com dados do contrato
  const userPrompt = `Gere um contrato de locação residencial completo e profissional baseado no seguinte template e dados:

TEMPLATE:
${preProcessedTemplate}

DADOS ADICIONAIS:
- Locador: ${contractData.landlordName} (CPF: ${contractData.landlordCpf})
- Locatário: ${contractData.tenantName} (CPF: ${contractData.tenantCpf})
${contractData.guarantorName ? `- Fiador: ${contractData.guarantorName} (CPF: ${contractData.guarantorCpf})` : ""}
- Imóvel: ${contractData.propertyAddress}, ${contractData.propertyCity}/${contractData.propertyState}
- Valor do aluguel: R$ ${contractData.monthlyRent.toFixed(2)}
- Período: ${contractData.periodMonths} meses (${contractData.startDate.toLocaleDateString("pt-BR")} a ${contractData.endDate.toLocaleDateString("pt-BR")})
- Garantia: ${contractData.guaranteeType}

Gere o contrato completo e formatado, preenchendo todos os placeholders restantes e garantindo que todas as cláusulas estejam completas e coerentes.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3, // Mais determinístico para contratos
      max_tokens: 4000,
    });

    const contractText = completion.choices[0]?.message?.content || "";

    if (!contractText) {
      throw new Error("A IA não retornou conteúdo para o contrato");
    }

    // Calcular metadados do contrato
    const metadata = {
      startDate: contractData.startDate.toISOString(),
      endDate: contractData.endDate.toISOString(),
      monthlyRent: contractData.monthlyRent,
      totalValue: contractData.monthlyRent * contractData.periodMonths,
      periodMonths: contractData.periodMonths,
      dueDay: contractData.dueDay,
      guarantee: {
        type: contractData.guaranteeType,
        details: contractData.guaranteeDetails || null,
      },
      // Gerar lista de parcelas
      installments: Array.from({ length: contractData.periodMonths }, (_, i) => {
        const date = new Date(contractData.startDate);
        date.setMonth(date.getMonth() + i);
        date.setDate(contractData.dueDay);
        return {
          number: i + 1,
          dueDate: date.toISOString(),
          amount: contractData.monthlyRent,
        };
      }),
    };

    return {
      contractText,
      metadata,
    };
  } catch (error: any) {
    console.error("Erro ao gerar contrato com IA:", error);
    throw new Error(
      `Erro ao gerar contrato: ${error.message || "Erro desconhecido"}`
    );
  }
}

// Gerar contrato sem IA (apenas substituição de placeholders)
export function generateContractSimple(contractData: ContractData): {
  contractText: string;
  metadata: any;
} {
  const template = readContractTemplate();

  // Preparar dados formatados (mesmo formato do AI)
  const formattedData = {
    LOCADOR_NOME: contractData.landlordName,
    LOCADOR_CPF: contractData.landlordCpf,
    LOCADOR_ENDERECO: contractData.landlordAddress || "",
    LOCADOR_CIDADE: contractData.landlordCity || "",
    LOCADOR_ESTADO: contractData.landlordState || "",
    LOCATARIO_NOME: contractData.tenantName,
    LOCATARIO_CPF: contractData.tenantCpf,
    LOCATARIO_ENDERECO: contractData.tenantAddress || "",
    LOCATARIO_ESTADO_CIVIL: contractData.tenantStateCivil || "",
    LOCATARIO_PROFISSAO: contractData.tenantProfession || "",
    SE_TEM_FIADOR: !!contractData.guarantorName,
    FIADOR_NOME: contractData.guarantorName || "",
    FIADOR_CPF: contractData.guarantorCpf || "",
    FIADOR_ENDERECO: contractData.guarantorAddress || "",
    IMOVEL_ENDERECO: contractData.propertyAddress,
    IMOVEL_CIDADE: contractData.propertyCity,
    IMOVEL_ESTADO: contractData.propertyState,
    IMOVEL_CEP: contractData.propertyZipcode,
    IMOVEL_DESCRICAO: contractData.propertyDescription,
    ALUGUEL_VALOR: contractData.monthlyRent.toFixed(2).replace(".", ","),
    ALUGUEL_VALOR_EXTENSO: numberToWords(contractData.monthlyRent),
    VENCIMENTO_DIA: contractData.dueDay,
    PERIODO_MES: contractData.periodMonths,
    DATA_INICIO: contractData.startDate.toLocaleDateString("pt-BR"),
    DATA_TERMINO: contractData.endDate.toLocaleDateString("pt-BR"),
    REAJUSTE_INDICE: contractData.adjustmentIndex || "IPCA",
    REAJUSTE_DESCRICAO: contractData.adjustmentIndex === "IPCA" 
      ? "Índice Nacional de Preços ao Consumidor Amplo"
      : contractData.adjustmentIndex === "IGP-M"
      ? "Índice Geral de Preços do Mercado"
      : contractData.adjustmentIndex || "IPCA",
    DATA_PRIMEIRO_REAJUSTE: new Date(
      contractData.startDate.getFullYear() + 1,
      contractData.startDate.getMonth(),
      contractData.startDate.getDate()
    ).toLocaleDateString("pt-BR"),
    GARANTIA_TIPO: contractData.guaranteeType === "fiador" ? "Fiador" :
                   contractData.guaranteeType === "caucao" ? "Caução" :
                   contractData.guaranteeType === "seguro" ? "Seguro-Fiança" :
                   "Sem Garantia",
    CAUCAO_VALOR: contractData.guaranteeType === "caucao" && contractData.guaranteeDetails?.value
      ? contractData.guaranteeDetails.value.toFixed(2).replace(".", ",")
      : "",
    CAUCAO_VALOR_EXTENSO: contractData.guaranteeType === "caucao" && contractData.guaranteeDetails?.value
      ? numberToWords(contractData.guaranteeDetails.value)
      : "",
    CAUCAO_MESES: contractData.guaranteeType === "caucao" && contractData.guaranteeDetails?.months
      ? contractData.guaranteeDetails.months
      : "",
    MULTA_PERCENTUAL: contractData.lateFeePercent || "2",
    JUROS_PERCENTUAL: contractData.interestPercent || "1",
    MULTA_RESCISAO: contractData.cancellationFee || "multa proporcional ao tempo restante",
    RESPONSAVEL_IPTU: contractData.iptuResponsible || "LOCADOR",
    RESPONSAVEL_UTILIDADES: contractData.utilitiesResponsible || "LOCATÁRIO",
    RESPONSAVEL_CONDOMINIO: contractData.condominiumResponsible || "LOCATÁRIO",
    RESPONSAVEL_TAXAS: contractData.taxesResponsible || "LOCATÁRIO",
    FORMA_PAGAMENTO: "link de pagamento ou boleto bancário",
    FORO: contractData.jurisdiction || contractData.propertyCity || "Comarca de origem do imóvel",
    DATA_CONTRATO: new Date().toLocaleDateString("pt-BR"),
  };

  const contractText = replacePlaceholders(template, formattedData);

  const metadata = {
    startDate: contractData.startDate.toISOString(),
    endDate: contractData.endDate.toISOString(),
    monthlyRent: contractData.monthlyRent,
    totalValue: contractData.monthlyRent * contractData.periodMonths,
    periodMonths: contractData.periodMonths,
    dueDay: contractData.dueDay,
    guarantee: {
      type: contractData.guaranteeType,
      details: contractData.guaranteeDetails || null,
    },
    installments: Array.from({ length: contractData.periodMonths }, (_, i) => {
      const date = new Date(contractData.startDate);
      date.setMonth(date.getMonth() + i);
      date.setDate(contractData.dueDay);
      return {
        number: i + 1,
        dueDate: date.toISOString(),
        amount: contractData.monthlyRent,
      };
    }),
  };

  return { contractText, metadata };
}


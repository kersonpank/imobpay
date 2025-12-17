# CONTRATO DE LOCAÇÃO RESIDENCIAL

## RESUMO EXECUTIVO

**Valor do Aluguel:** R$ {{ALUGUEL_VALOR}} mensais  
**Vencimento:** Todo dia {{VENCIMENTO_DIA}} de cada mês  
**Período:** {{DATA_INICIO}} a {{DATA_TERMINO}} ({{PERIODO_MES}} meses)  
**Garantia:** {{GARANTIA_TIPO}}  
**Índice de Reajuste:** {{REAJUSTE_INDICE}}

---

## PARTES CONTRATANTES

**LOCADOR(A):** {{LOCADOR_NOME}}, CPF/CNPJ: {{LOCADOR_CPF}}, residente e domiciliado(a) em {{LOCADOR_ENDERECO}}.

**LOCATÁRIO(A):** {{LOCATARIO_NOME}}, CPF: {{LOCATARIO_CPF}}, {{LOCATARIO_ESTADO_CIVIL}}, {{LOCATARIO_PROFISSAO}}, residente e domiciliado(a) em {{LOCATARIO_ENDERECO}}.

{{#SE_TEM_FIADOR}}
**FIADOR(A):** {{FIADOR_NOME}}, CPF: {{FIADOR_CPF}}, residente e domiciliado(a) em {{FIADOR_ENDERECO}}.
{{/SE_TEM_FIADOR}}

---

## CLÁUSULA PRIMEIRA - DO OBJETO

O presente contrato tem por objeto a locação do imóvel situado em **{{IMOVEL_ENDERECO}}**, {{IMOVEL_CIDADE}}/{{IMOVEL_ESTADO}}, CEP {{IMOVEL_CEP}}, conforme descrição: {{IMOVEL_DESCRICAO}}.

---

## CLÁUSULA SEGUNDA - DO PRAZO

O prazo de locação é de **{{PERIODO_MES}} meses**, tendo início em **{{DATA_INICIO}}** e término em **{{DATA_TERMINO}}**, podendo ser prorrogado mediante acordo entre as partes ou renovado automaticamente, desde que nenhuma das partes comunique a intenção de rescindir com antecedência mínima de 30 (trinta) dias.

---

## CLÁUSULA TERCEIRA - DO VALOR E FORMA DE PAGAMENTO

3.1. O valor mensal do aluguel é de **R$ {{ALUGUEL_VALOR}}** ({{ALUGUEL_VALOR_EXTENSO}}), devendo ser pago até o dia **{{VENCIMENTO_DIA}}** de cada mês.

3.2. O pagamento será efetuado através de {{FORMA_PAGAMENTO}}, conforme link ou boleto fornecido pelo LOCADOR.

3.3. Em caso de atraso no pagamento, será aplicada multa de **{{MULTA_PERCENTUAL}}%** sobre o valor devido, além de juros de mora de **{{JUROS_PERCENTUAL}}%** ao mês, calculados sobre o valor em atraso.

---

## CLÁUSULA QUARTA - DO REAJUSTE

4.1. O valor do aluguel será reajustado anualmente pelo índice **{{REAJUSTE_INDICE}}** ({{REAJUSTE_DESCRICAO}}), medido no mês de referência anterior à data do reajuste.

4.2. O primeiro reajuste ocorrerá em **{{DATA_PRIMEIRO_REAJUSTE}}**, e os subsequentes na mesma data, anualmente.

---

## CLÁUSULA QUINTA - DAS GARANTIAS

5.1. O LOCATÁRIO oferece como garantia do cumprimento das obrigações contratuais:

{{#GARANTIA_CAUCAO}}
**CAUÇÃO:** Depósito no valor de R$ {{CAUCAO_VALOR}} ({{CAUCAO_VALOR_EXTENSO}}), equivalente a {{CAUCAO_MESES}} meses de aluguel, que será devolvido ao término do contrato, deduzidos eventuais débitos ou danos ao imóvel.
{{/GARANTIA_CAUCAO}}

{{#GARANTIA_FIADOR}}
**FIADOR SOLIDÁRIO:** {{FIADOR_NOME}}, CPF {{FIADOR_CPF}}, que se compromete a responder solidariamente por todas as obrigações do LOCATÁRIO, incluindo pagamento de aluguéis, encargos, multas e danos ao imóvel.
{{/GARANTIA_FIADOR}}

{{#GARANTIA_SEGURO}}
**SEGURO-FIANÇA:** Apólice de seguro-fiança contratada junto à {{SEGURO_EMPRESA}}, apólice nº {{SEGURO_APOLICE}}, vigência de {{SEGURO_VIGENCIA}}.
{{/GARANTIA_SEGURO}}

{{#GARANTIA_NENHUMA}}
**SEM GARANTIA ADICIONAL:** O contrato seguirá sem garantia adicional além das obrigações contratuais do LOCATÁRIO.
{{/GARANTIA_NENHUMA}}

---

## CLÁUSULA SEXTA - DAS OBRIGAÇÕES DO LOCATÁRIO

6.1. Pagar pontualmente o aluguel e demais encargos;

6.2. Usar o imóvel exclusivamente para fins residenciais;

6.3. Manter o imóvel em bom estado de conservação, realizando pequenos reparos e manutenções de uso;

6.4. Não realizar alterações no imóvel sem prévia autorização escrita do LOCADOR;

6.5. Permitir vistorias periódicas pelo LOCADOR, mediante aviso prévio de 24 horas;

6.6. Comunicar imediatamente ao LOCADOR qualquer dano ou necessidade de reparo;

6.7. Não sublocar, ceder ou emprestar o imóvel sem autorização;

6.8. Responsabilizar-se pelos danos causados por si, seus dependentes, visitantes ou terceiros;

6.9. Devolver o imóvel ao término do contrato nas mesmas condições em que foi recebido, considerando o desgaste natural.

---

## CLÁUSULA SÉTIMA - DAS OBRIGAÇÕES DO LOCADOR

7.1. Entregar o imóvel em condições de uso, conforme descrito;

7.2. Garantir o uso pacífico do imóvel durante a vigência do contrato;

7.3. Realizar reparos e manutenções de estrutura, instalações hidráulicas e elétricas;

7.4. Comunicar com antecedência sobre visitas e vistorias.

---

## CLÁUSULA OITAVA - DOS ENCARGOS E IMPOSTOS

8.1. **IPTU:** {{RESPONSAVEL_IPTU}}

8.2. **Água, Energia Elétrica e Gás:** {{RESPONSAVEL_UTILIDADES}}

8.3. **Condomínio:** {{RESPONSAVEL_CONDOMINIO}}

8.4. **Taxas e Impostos Municipais:** {{RESPONSAVEL_TAXAS}}

---

## CLÁUSULA NONA - DA VISTORIA

9.1. Será realizada vistoria inicial na data de início do contrato, documentada em fotos e checklist anexo.

9.2. Ao término do contrato, será realizada vistoria final, onde serão avaliados danos além do desgaste natural, que serão debitados da caução ou cobrados do LOCATÁRIO.

---

## CLÁUSULA DÉCIMA - DA RESCISÃO

10.1. O contrato poderá ser rescindido por qualquer das partes com aviso prévio de 30 (trinta) dias.

10.2. Em caso de rescisão antecipada pelo LOCATÁRIO, será devida multa equivalente a {{MULTA_RESCISAO}}.

10.3. Em caso de descumprimento das obrigações pelo LOCATÁRIO, o LOCADOR poderá rescindir o contrato imediatamente, sem necessidade de aviso prévio, após notificação e permanência do inadimplemento por 30 (trinta) dias.

---

## CLÁUSULA DÉCIMA PRIMEIRA - DISPOSIÇÕES GERAIS

11.1. O presente contrato rege-se pelas leis brasileiras, especialmente o Código de Defesa do Consumidor, Lei nº 8.245/91 (Lei de Locações) e demais legislações aplicáveis.

11.2. Fica eleito o foro da comarca de **{{FORO}}** para dirimir eventuais questões decorrentes do presente contrato.

11.3. As partes declaram ter ciência e concordância com todos os termos deste contrato.

11.4. Este contrato e seus anexos constituem o acordo completo entre as partes, substituindo qualquer acordo anterior.

---

## ASSINATURAS

**{{LOCADOR_CIDADE}}/{{LOCADOR_ESTADO}}, {{DATA_CONTRATO}}**

---

**LOCADOR(A):**  
_______________________________________  
{{LOCADOR_NOME}}  
CPF/CNPJ: {{LOCADOR_CPF}}

---

**LOCATÁRIO(A):**  
_______________________________________  
{{LOCATARIO_NOME}}  
CPF: {{LOCATARIO_CPF}}

---

{{#SE_TEM_FIADOR}}
**FIADOR(A):**  
_______________________________________  
{{FIADOR_NOME}}  
CPF: {{FIADOR_CPF}}
{{/SE_TEM_FIADOR}}

---

**TESTEMUNHAS:**

1. _______________________________________  
   Nome: _____________________ CPF: _____________________

2. _______________________________________  
   Nome: _____________________ CPF: _____________________

---

**ANEXOS:**
- Checklist de Vistoria Inicial
- Fotos do Imóvel
- Documentos das Partes


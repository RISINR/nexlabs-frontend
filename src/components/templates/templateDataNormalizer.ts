type AnyRecord = Record<string, any>;

export function normalizeTemplateData(rawData: AnyRecord): AnyRecord {
  const data = rawData || {};
  const basicInfo = data.basicInfo || {};
  const professionalSummary = data.professionalSummary || {};

  const firstName = String(basicInfo.firstName || '').trim();
  const lastName = String(basicInfo.lastName || '').trim();
  const computedFullName = `${firstName} ${lastName}`.trim();

  if (!String(basicInfo.fullName || '').trim() && computedFullName) {
    basicInfo.fullName = computedFullName;
  }

  const futureGoal = String(
    basicInfo.futureGoal || professionalSummary.goal || ''
  ).trim();

  if (futureGoal) {
    professionalSummary.goal = professionalSummary.goal || futureGoal;

    const description = String(professionalSummary.description || '').trim();
    const goalLine = `Career Goal: ${futureGoal}`;

    if (!description) {
      professionalSummary.description = goalLine;
    } else if (!description.toLowerCase().includes(futureGoal.toLowerCase())) {
      professionalSummary.description = `${description}\n\n${goalLine}`;
    }
  }

  data.basicInfo = basicInfo;
  data.professionalSummary = professionalSummary;
  return data;
}

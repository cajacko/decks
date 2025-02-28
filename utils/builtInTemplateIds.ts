// NOTE: Do not change these ID's as people's existing mappings will break
export default function builtInTemplateIds(templateId: string) {
  return {
    templateId: `BUILT_IN_TEMPLATE:${templateId}`,
    // This is always scoped to the template anyway so can keep simple
    dataItemId: (dataItemId: string) => dataItemId,
  };
}

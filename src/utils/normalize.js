export const normalizeApplication = (app) => {
  return {
    ...app,
    status:
      typeof app.status === "string"
        ? app.status.replace(/^["']|["']$/g, "")
        : app.status,
  };
};

export const normalizeApplications = (apps) => {
  return apps.map((app) => normalizeApplication(app));
};

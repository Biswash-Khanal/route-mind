export const TursoDate = {
  /**
   * Converts the turso CURRENT_TIMESTAMP default string into js compatible date format.
   *
   * @export
   * @param {string} tursoDate
   * @returns {Date}
   */
  toJs(tursoDate: string): Date {
    return new Date(tursoDate.replace(" ", "T") + "Z");
  },

  /**
   * Converts the js date format into the turso CURRENT_TIMESTAMP string format.
   *
   * @export
   * @param {Date} jsDate
   * @returns {string}
   */
  toTurso(jsDate: Date): string {
    return jsDate.toISOString().slice(0, 19).replace("T", " ");
  },
};

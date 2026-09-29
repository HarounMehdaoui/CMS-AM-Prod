/** Builds a `col = $1, col2 = $2, ...` SET clause + params array for a partial update. */
export function buildUpdateSet(
  colMap: Record<string, string>,
  fields: Record<string, unknown>
) {
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  for (const [key, val] of Object.entries(fields)) {
    const col = colMap[key];
    if (!col) continue;
    setClauses.push(`${col} = $${i}`);
    values.push(val);
    i++;
  }
  return { setClauses, values, nextIndex: i };
}

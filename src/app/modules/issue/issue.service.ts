import pool from '../../config/db';
import { IIssue, IIssueUpdate } from './issue.interface';
import AppError from '../../utils/AppError';

export const createIssue = async (data: IIssue, reporterId: number): Promise<IIssue> => {
  const { title, description, type } = data;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporterId]
  );

  return result.rows[0];
};

export const getAllIssues = async (query: {
  sort?: string;
  type?: string;
  status?: string;
}): Promise<IIssue[]> => {
  const conditions: string[] = [];
  const values: string[] = [];
  let index = 1;

  if (query.type) {
    conditions.push(`type = $${index}`);
    values.push(query.type);
    index++;
  }

  if (query.status) {
    conditions.push(`status = $${index}`);
    values.push(query.status);
    index++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderClause = query.sort === 'oldest' ? 'ORDER BY created_at ASC' : 'ORDER BY created_at DESC';

  const result = await pool.query(
    `SELECT * FROM issues ${whereClause} ${orderClause}`,
    values
  );

  const issues = result.rows;

  if (issues.length === 0) return [];

  // fetch reporters separately
  const reporterIds = [...new Set(issues.map((i: IIssue) => i.reporter_id))];
  const reporters = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [reporterIds]
  );

  const reporterMap: Record<number, object> = {};
  reporters.rows.forEach((r: { id: number; name: string; role: string }) => {
    reporterMap[r.id] = r;
  });

  return issues.map((issue: IIssue & { reporter_id: number }) => {
    const { reporter_id, ...rest } = issue;
    return {
      ...rest,
      reporter: reporterMap[reporter_id] || null,
    };
  });
};

export const getSingleIssue = async (id: number): Promise<IIssue> => {
  const result = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    throw new AppError('Issue not found', 404);
  }

  const issue = result.rows[0];

  const reporter = await pool.query(
    'SELECT id, name, role FROM users WHERE id = $1',
    [issue.reporter_id]
  );

  const { reporter_id, ...rest } = issue;

  return {
    ...rest,
    reporter: reporter.rows[0] || null,
  };
};

export const updateIssue = async (
  id: number,
  data: IIssueUpdate,
  userId: number,
  userRole: string
): Promise<IIssue> => {
  const issue = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);

  if (issue.rows.length === 0) {
    throw new AppError('Issue not found', 404);
  }

  const existingIssue = issue.rows[0];

  // contributor can only update own issue and only if status is open
  if (userRole === 'contributor') {
    if (existingIssue.reporter_id !== userId) {
      throw new AppError('You can only update your own issues', 403);
    }
    if (existingIssue.status !== 'open') {
      throw new AppError('You can only update issues with open status', 409);
    }
  }

  const fields: string[] = [];
  const values: (string | number)[] = [];
  let index = 1;

  if (data.title) {
    fields.push(`title = $${index}`);
    values.push(data.title);
    index++;
  }
  if (data.description) {
    fields.push(`description = $${index}`);
    values.push(data.description);
    index++;
  }
  if (data.type) {
    fields.push(`type = $${index}`);
    values.push(data.type);
    index++;
  }
  if (data.status && userRole === 'maintainer') {
    fields.push(`status = $${index}`);
    values.push(data.status);
    index++;
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE issues SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
    values
  );

  return result.rows[0];
};

export const deleteIssue = async (id: number): Promise<void> => {
  const issue = await pool.query('SELECT id FROM issues WHERE id = $1', [id]);

  if (issue.rows.length === 0) {
    throw new AppError('Issue not found', 404);
  }

  await pool.query('DELETE FROM issues WHERE id = $1', [id]);
};
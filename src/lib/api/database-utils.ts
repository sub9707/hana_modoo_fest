import { queryOne } from '@/lib/db'

export async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const result = await queryOne(
      `SELECT COUNT(*) as count
       FROM information_schema.tables
       WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName]
    ) as { count: number } | null
    return result ? result.count > 0 : false
  } catch (error) {
    console.warn(`테이블 ${tableName} 존재 여부 확인 실패:`, error)
    return false
  }
}

export interface WhereClause {
  clause: string
  params: any[]
}

export function buildWhereClause(conditions: Record<string, any>): WhereClause {
  const clauses: string[] = []
  const params: any[] = []

  for (const [key, value] of Object.entries(conditions)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'string' && value.includes('%')) {
        clauses.push(`${key} LIKE ?`)
      } else {
        clauses.push(`${key} = ?`)
      }
      params.push(value)
    }
  }

  const clause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : ''
  return { clause, params }
}

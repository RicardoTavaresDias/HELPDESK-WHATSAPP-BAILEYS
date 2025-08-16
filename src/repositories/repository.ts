import db from "@/config/postgres";

class Repository {
  async variousqueriesAI (querySQLAI: string) {
    try {
      const query = await db.query(querySQLAI);
      return query.rows
    } catch (error) {
      return error
    }
  }

  private async queryCalledUsers (searchForInformation: string) {
    const query = await db.query(`

      SELECT
        c.id AS id_called,
        c.title_called,
        c.description AS description_called,
        c.call_status AS statu_called,
        c."appointment_Time",
        c.updated_at AS updated_at_called,
        ut.name AS name_technical,
        ut.email AS email_technical,
        ut.role AS role_technical,
        uc.name AS name_customer,
        uc.email AS email_customer,
        uc.role AS role_customer,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'title_service', s.title_service,
            'price_service', s.price
          )) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) AS services,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'description_comments', co.description,
            'updated_at_comments', co.updated_at
          )) FILTER (WHERE co.id IS NOT NULL), '[]'
        ) AS comments
      FROM "called" c
      LEFT JOIN "user" ut on ut.id = c.fk_user_technical
      LEFT JOIN "user" uc on uc.id = c.fk_user_customer
      LEFT JOIN "called_comments" cc on cc.fk_called = c.id
      LEFT JOIN "comments" co on co.id = cc.fk_comments
      LEFT JOIN "called_services" cs on cs.fk_called = c.id
      LEFT JOIN "services" s on s.id = cs.fk_services
      WHERE ${searchForInformation}
      GROUP BY c.id, c.title_called, c.description, c.call_status, c."appointment_Time", c.updated_at, ut.name, ut.email, ut.role, uc.name, uc.email, uc.role

    `.trim())

    return query.rows
  }

  async calleds (email: string) {
    const userCustomer = await this.queryCalledUsers(`uc.email = '${email}'`)
    if(userCustomer.length > 0) {
      return userCustomer
    } 
    
    return await this.queryCalledUsers(`ut.email = '${email}'`)
  }

  async calledID (id: string) {
    return await this.queryCalledUsers(`c.id = ${id}`)
  } 
}

export default Repository
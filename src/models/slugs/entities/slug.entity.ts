import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'slug',
  timestamps: false,
  indexes: [
    {
      name: 'idx_slug_slug_language',
      unique: true,
      fields: ['slug', 'lang'],
    },
  ],
})
export class Slug extends Model<Slug> {
  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lang: string;

  @Column({ type: DataType.STRING, allowNull: false })
  resource_type: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  resource_id: number;
}

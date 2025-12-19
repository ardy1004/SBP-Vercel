import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, numeric, integer, timestamp, uuid } from "drizzle-orm/pg-core";

// Location tables
export const provinces = pgTable("provinces", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: varchar("code", { length: 10 }).unique(),
});

export const districts = pgTable("districts", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  provinceId: integer("province_id").notNull().references(() => provinces.id),
});

export const subdistricts = pgTable("subdistricts", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  districtId: integer("district_id").notNull().references(() => districts.id),
});

export const villages = pgTable("villages", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  subdistrictId: integer("subdistrict_id").notNull().references(() => subdistricts.id),
  postalCode: varchar("postal_code", { length: 10 }),
});

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  kodeListing: text("kode_listing").notNull().unique(),
  judulProperti: text("judul_properti"),
  deskripsi: text("deskripsi"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  jenisProperti: text("jenis_properti").notNull(),
  luasTanah: numeric("luas_tanah"),
  luasBangunan: numeric("luas_bangunan"),
  kamarTidur: integer("kamar_tidur"),
  kamarMandi: integer("kamar_mandi"),
  legalitas: text("legalitas"),
  hargaProperti: numeric("harga_properti").notNull(),
  hargaPerMeter: boolean("harga_per_meter").default(false).notNull(),
  provinsi: text("provinsi").notNull(),
  kabupaten: text("kabupaten").notNull(),
  kecamatan: text("kecamatan"),
  kelurahan: text("kelurahan"),
  kecamatanId: integer("kecamatan_id").references(() => subdistricts.id),
  kelurahanId: integer("kelurahan_id").references(() => villages.id),
  alamatLengkap: text("alamat_lengkap"),
  imageUrl: text("image_url").notNull(),
  imageUrl1: text("image_url1"),
  imageUrl2: text("image_url2"),
  imageUrl3: text("image_url3"),
  imageUrl4: text("image_url4"),
  imageUrl5: text("image_url5"),
  imageUrl6: text("image_url6"),
  imageUrl7: text("image_url7"),
  imageUrl8: text("image_url8"),
  imageUrl9: text("image_url9"),
  youtubeUrl: text("youtube_url"),
  isPremium: boolean("is_premium").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isHot: boolean("is_hot").default(false).notNull(),
  isSold: boolean("is_sold").default(false).notNull(),
  priceOld: numeric("price_old"),
  isPropertyPilihan: boolean("is_property_pilihan").default(false).notNull(),
  ownerContact: text("owner_contact"),
  status: text("status").notNull(),
  fts: text("fts"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Inquiries table
export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
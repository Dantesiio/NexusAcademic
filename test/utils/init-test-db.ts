import { DataSource } from 'typeorm';

export async function initTestDatabase() {
  console.log('Inicializando base de datos de pruebas...');
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    database: 'prueba1_test',
    synchronize: false, // Importante: No queremos sincronizar automáticamente
    entities: [],
  });

  try {
    // Conectar a la base de datos
    await dataSource.initialize();
    console.log('Conexión a base de datos establecida');

    // Eliminar todas las tablas si existen (orden es importante debido a las relaciones)
    try {
      console.log('Eliminando tablas existentes...');
      // Orden específico para respetar las restricciones de clave foránea
      await dataSource.query('DROP TABLE IF EXISTS submissions CASCADE');
      await dataSource.query('DROP TABLE IF EXISTS courses CASCADE');
      await dataSource.query('DROP TABLE IF EXISTS grade CASCADE');
      await dataSource.query('DROP TABLE IF EXISTS students CASCADE');
      await dataSource.query('DROP TABLE IF EXISTS users CASCADE');
      console.log('Tablas eliminadas correctamente');
    } catch (error) {
      console.error('Error al eliminar tablas:', error);
    }

    // Cerrar la conexión
    await dataSource.destroy();
    console.log('Inicialización de base de datos completada');
    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    throw error;
  }
}
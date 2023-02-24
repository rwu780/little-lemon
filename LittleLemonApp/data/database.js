import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('little-lemon');

export async function createTable() {
    return new Promise((resolve, reject) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    'create table if not exists menuitems(id integer primary key not null, name text, price text, description text, image text, category text);'
                );
            },
            reject,
            resolve
        );
    });
}

export async function getMenuItems() {
    return new Promise((resolve) => {
        db.transaction(
            (tx) => {
                tx.executeSql('select * from menuitems', [], (_, { rows }) => {
                    resolve(rows._array);
                });
            });
    });
}

export async function saveMenuItems(menuItems) {
    db.transaction(
        (tx) => {
            menuItems.forEach(element => {
                tx.executeSql(
                    'insert into menuitems(name, price, description, image, category) values(?, ?, ?, ?, ?)',
                    [element.name, element.price, element.description, element.image, element.category],
                    () => {
                        console.log('Success')
                    },
                    (error) => {
                        console.log('Error: ', error)
                    }
                )
            })
        }
    )
}

export async function fetchFilterItems(query, activeCategories) {
    return new Promise(
        (resolve) => {
            db.transaction(
                (tx) => {
                    const searchQuery = (activeCategories.length === 0)
                        ? `select * from menuitems where name like '%${query}%'`
                        : `select * from menuitems where name like '%${query}%' and category  IN (${activeCategories.map(item => "'" + item + "'").join(',')})`;
                                    
                    
                    tx.executeSql(
                        searchQuery,
                        [],
                        (_, { rows }) => {
                            // console.log("result : ", rows)
                            resolve(rows._array);
                        })
                },
                (error) => {
                    console.log(error)
                })
        }
    )
}
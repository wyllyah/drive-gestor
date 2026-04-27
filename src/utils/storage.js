const PREFIX = 'drivegestor';

const getKey = (collection) => `${PREFIX}:${collection}`;

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export function listItems(collection) {
  try {
    const data = localStorage.getItem(getKey(collection));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveItems(collection, items) {
  localStorage.setItem(getKey(collection), JSON.stringify(items));
}

export function addItem(collection, item) {
  const items = listItems(collection);
  const newItem = {
    id: createId(),
    createdAt: new Date().toISOString(),
    ...item,
  };

  saveItems(collection, [newItem, ...items]);
  return newItem;
}

export function updateItem(collection, id, updates) {
  const items = listItems(collection);
  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item,
  );

  saveItems(collection, updatedItems);
  return updatedItems.find((item) => item.id === id);
}

export function deleteItem(collection, id) {
  const items = listItems(collection).filter((item) => item.id !== id);
  saveItems(collection, items);
}

import DatabaseService from '../services/DatabaseService.js';

export function setupDnD(container, onOrderChange) {
  let draggedItem = null;

  container.addEventListener('dragstart', (e) => {
    draggedItem = e.target.closest('.album-card');
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => draggedItem.style.opacity = '0.5', 0);
  });

  container.addEventListener('dragend', (e) => {
    draggedItem.style.opacity = '1';
    draggedItem = null;
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const overItem = e.target.closest('.album-card');
    if (overItem && overItem !== draggedItem) {
      const rect = overItem.getBoundingClientRect();
      const midpoint = rect.left + rect.width / 2;
      if (e.clientX < midpoint) {
        container.insertBefore(draggedItem, overItem);
      } else {
        container.insertBefore(draggedItem, overItem.nextSibling);
      }
    }
  });

  container.addEventListener('drop', async (e) => {
    e.preventDefault();
    const newOrder = Array.from(container.querySelectorAll('.album-card')).map((card, index) => ({
      id: parseInt(card.dataset.id),
      display_order: index + 1
    }));
    
    await persistNewOrder(newOrder);
    if (onOrderChange) onOrderChange(newOrder);
  });
}

async function persistNewOrder(newOrder) {
  const db = DatabaseService.getDb();
  db.run('BEGIN TRANSACTION');
  try {
    for (const item of newOrder) {
      db.run('UPDATE Albums SET display_order = ? WHERE id = ?', [item.display_order, item.id]);
    }
    db.run('COMMIT');
  } catch (error) {
    db.run('ROLLBACK');
    console.error('Failed to persist new album order:', error);
  }
}

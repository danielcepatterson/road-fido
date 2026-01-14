import { useState, useEffect } from "react";
import "./App.css";

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
};

type List = {
  id: string;
  name: string;
  items: ListItem[];
  createdAt: number;
  updatedAt: number;
};

export default function Lists() {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [editingListName, setEditingListName] = useState<string | null>(null);

  // Load lists from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lists");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLists(parsed);
        if (parsed.length > 0 && !selectedListId) {
          setSelectedListId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse saved lists:", e);
      }
    }
  }, []);

  // Save lists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  const selectedList = lists.find((l) => l.id === selectedListId);

  // Create a new list
  const handleCreateList = () => {
    if (!newListName.trim()) return;

    const newList: List = {
      id: Date.now().toString(),
      name: newListName,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setLists([...lists, newList]);
    setSelectedListId(newList.id);
    setNewListName("");
  };

  // Delete a list
  const handleDeleteList = (id: string) => {
    setLists(lists.filter((l) => l.id !== id));
    if (selectedListId === id) {
      setSelectedListId(lists.length > 1 ? lists[0].id : null);
    }
  };

  // Add item to selected list
  const handleAddItem = () => {
    if (!selectedList || !newItemText.trim()) return;

    const updatedLists = lists.map((list) =>
      list.id === selectedList.id
        ? {
            ...list,
            items: [
              ...list.items,
              {
                id: Date.now().toString(),
                text: newItemText,
                completed: false,
              },
            ],
            updatedAt: Date.now(),
          }
        : list
    );

    setLists(updatedLists);
    setNewItemText("");
  };

  // Toggle item completion
  const handleToggleItem = (itemId: string) => {
    if (!selectedList) return;

    const updatedLists = lists.map((list) =>
      list.id === selectedList.id
        ? {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
            updatedAt: Date.now(),
          }
        : list
    );

    setLists(updatedLists);
  };

  // Delete item from list
  const handleDeleteItem = (itemId: string) => {
    if (!selectedList) return;

    const updatedLists = lists.map((list) =>
      list.id === selectedList.id
        ? {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
            updatedAt: Date.now(),
          }
        : list
    );

    setLists(updatedLists);
  };

  // Rename list
  const handleRenameList = (id: string, newName: string) => {
    if (!newName.trim()) return;

    const updatedLists = lists.map((list) =>
      list.id === id
        ? { ...list, name: newName, updatedAt: Date.now() }
        : list
    );

    setLists(updatedLists);
    setEditingListName(null);
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        📝 Lists{" "}
        <span role="img" aria-label="clipboard" style={{ fontSize: "0.8em" }}>
          📋
        </span>
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: 20,
          minHeight: "600px",
        }}
      >
        {/* Left Sidebar - List Management */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card" style={{ padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Create List</h3>
            <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateList();
                }}
                placeholder="List name..."
                style={{ padding: 8, borderRadius: 4, border: "1px solid #666" }}
              />
              <button
                onClick={handleCreateList}
                style={{
                  padding: 8,
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                ➕ New List
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: 12, flex: 1, overflow: "auto" }}>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Your Lists</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lists.length === 0 ? (
                <p style={{ color: "#999", fontSize: 12 }}>No lists yet</p>
              ) : (
                lists.map((list) => (
                  <div
                    key={list.id}
                    style={{
                      padding: 10,
                      backgroundColor:
                        selectedListId === list.id ? "rgba(100, 150, 255, 0.3)" : "rgba(0,0,0,0.2)",
                      borderRadius: 4,
                      cursor: "pointer",
                      border: selectedListId === list.id ? "2px solid #6496ff" : "1px solid transparent",
                      transition: "all 0.2s",
                    }}
                    onClick={() => setSelectedListId(list.id)}
                  >
                    <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4 }}>
                      {list.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#999" }}>
                      {list.items.length} item{list.items.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - List Items */}
        <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column" }}>
          {selectedList ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                {editingListName === selectedList.id ? (
                  <input
                    type="text"
                    value={selectedList.name}
                    onChange={(e) => {
                      const updated = lists.map((list) =>
                        list.id === selectedList.id
                          ? { ...list, name: e.target.value }
                          : list
                      );
                      setLists(updated);
                    }}
                    onBlur={() => handleRenameList(selectedList.id, selectedList.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleRenameList(selectedList.id, selectedList.name);
                    }}
                    autoFocus
                    style={{ padding: 8, borderRadius: 4, border: "1px solid #666", fontSize: 20, fontWeight: "bold" }}
                  />
                ) : (
                  <>
                    <h2 style={{ margin: 0, flex: 1 }}>{selectedList.name}</h2>
                    <button
                      onClick={() => setEditingListName(selectedList.id)}
                      title="Rename list"
                      style={{
                        padding: 6,
                        backgroundColor: "rgba(100, 150, 255, 0.3)",
                        border: "1px solid rgba(100, 150, 255, 0.5)",
                        borderRadius: 4,
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteList(selectedList.id)}
                      title="Delete list"
                      style={{
                        padding: 6,
                        backgroundColor: "rgba(255, 100, 100, 0.3)",
                        border: "1px solid rgba(255, 100, 100, 0.5)",
                        borderRadius: 4,
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>

              {/* Add Item Section */}
              <div style={{ marginBottom: 16, padding: 12, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 4 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddItem();
                    }}
                    placeholder="Add new item..."
                    style={{
                      flex: 1,
                      padding: 8,
                      borderRadius: 4,
                      border: "1px solid #666",
                    }}
                  />
                  <button
                    onClick={handleAddItem}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ➕ Add
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div style={{ flex: 1, overflow: "auto" }}>
                {selectedList.items.length === 0 ? (
                  <p style={{ color: "#999", textAlign: "center", paddingTop: 20 }}>
                    No items yet. Add one above!
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedList.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: 10,
                          backgroundColor: "rgba(0,0,0,0.2)",
                          borderRadius: 4,
                          borderLeft: `4px solid ${item.completed ? "#999" : "#4CAF50"}`,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleItem(item.id)}
                          style={{
                            width: 18,
                            height: 18,
                            cursor: "pointer",
                          }}
                        />
                        <span
                          style={{
                            flex: 1,
                            textDecoration: item.completed ? "line-through" : "none",
                            color: item.completed ? "#999" : "inherit",
                          }}
                        >
                          {item.text}
                        </span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete item"
                          style={{
                            padding: 4,
                            backgroundColor: "rgba(255, 100, 100, 0.3)",
                            border: "1px solid rgba(255, 100, 100, 0.5)",
                            borderRadius: 3,
                            cursor: "pointer",
                            color: "white",
                            fontSize: 12,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 12,
                  color: "#999",
                }}
              >
                Completed: {selectedList.items.filter((i) => i.completed).length} /{" "}
                {selectedList.items.length}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#999", paddingTop: 40 }}>
              <p>Create a list to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

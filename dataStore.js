const DataStore = (() => {
  let _records = [];
  let _nextId = 1;

  // Debug helper function
  const debugLog = (method, message, data) => {
    console.group(`DataStore.${method}`);
    console.log(message);
    if (data) console.log('Data:', data);
    console.log('Current Records:', _records.map(record => [record.id, record]));
    console.log('Next ID:', _nextId);
    console.groupEnd();
  };

  return {
    add(data = {}) {
      //debugLog('add', 'Adding new record', data);
      const id = _nextId++;
      _records.push({ id, ...data });
      //debugLog('add', 'Record added successfully', { id, ...data });
      return id;
    },
    updateByIndex(rowIndex, data) {
      if (rowIndex >= 0 && rowIndex < _records.length) {
        const record = _records[rowIndex];
        _records[rowIndex] = { ...record, ...data };
        //debugLog('updateByIndex', 'Updated record at index', { rowIndex, data });
      }
    },
    removeByIndex(rowIndex) {
      if (rowIndex >= 0 && rowIndex < _records.length) {
        _records.splice(rowIndex, 1);
        //debugLog('removeByIndex', 'Removed record at index', { rowIndex });
      }
    },
    getByIndex(rowIndex) {
      if (rowIndex >= 0 && rowIndex < _records.length) {
        return _records[rowIndex];
      }
      return null;
    },
    getAll() {
      return [..._records];
    },
    duplicateByIndex(rowIndex) {
      if (rowIndex >= 0 && rowIndex < _records.length) {
        const record = _records[rowIndex];
        const newId = _nextId++;
        const newRecord = { id: newId, ...record };
        _records.splice(rowIndex + 1, 0, newRecord);
        //debugLog('duplicateByIndex', 'Duplicated record at index', { rowIndex, newId });
        return newId;
      }
      return null;
    },
    clear() {
      _records = [];
      _nextId = 1;
    },
    export() {
      return JSON.stringify(this.getAll(), null, 2);
    },
    import(json) {
      const arr = Array.isArray(json) ? json : JSON.parse(json);
      _records = [];
      arr.forEach(obj => {
        const id = obj.id || _nextId++;
        _records.push({ ...obj, id });
        if (id >= _nextId) _nextId = id + 1;
      });
    },
    insertAfter(rowIndex, data = {}) {
      //debugLog('insertAfter', 'Attempting to insert after record', { rowIndex, data });
      const newId = _nextId++;
      const newRecord = { id: newId, ...data };
      
      // Log current records for debugging
      //debugLog('insertAfter', 'Current records:', _records);
      
      // Insert after the specified row index
      if (rowIndex >= 0 && rowIndex < _records.length) {
        _records.splice(rowIndex + 1, 0, newRecord);
        //debugLog('insertAfter', 'Inserted after row index', { rowIndex });
      } else {
        // Add to end if index is out of bounds
        _records.push(newRecord);
        //debugLog('insertAfter', 'Row index out of bounds, added to end', { rowIndex });
      }
      
      //debugLog('insertAfter', 'Insertion complete', { newId });
      return newId;
    },
    setAll(arrayOfRecords) {
      _records = [];
      arrayOfRecords.forEach(obj => {
        const id = obj.id || _nextId++;
        _records.push({ ...obj, id });
        if (id >= _nextId) _nextId = id + 1;
      });
    }        
  };
})();

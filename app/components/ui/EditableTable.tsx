'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  FormInstance,
} from 'antd';
import type { ColumnType as AntdColumnType } from 'antd/es/table';
import type { ReactNode } from 'react';

interface ColumnType<T> extends AntdColumnType<T> {
  editable?: boolean;
}

interface Item {
  key: React.Key;
  name: string;
  quantity: number;
  price: number;
}

interface EditableTableProps {
  dataSource: Item[];
  setDataSource: React.Dispatch<React.SetStateAction<Item[]>>;
  handleAdd?: (newItem: Omit<Item, 'key'>) => void;
  handleDelete?: (key: React.Key) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({
  dataSource,
  setDataSource,
  handleAdd,
  handleDelete,
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<React.Key | null>(null);
  const dataRef = useRef(dataSource);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    dataRef.current = dataSource;
  }, [dataSource]);

  useEffect(() => {
    if (hasChanged) {
      setHasChanged(false);
      setDataSource(dataRef.current);
    }
  }, [hasChanged, setDataSource]);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Item) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newData = dataRef.current.map((item) => {
        if (item.key === key) {
          return { ...item, ...row };
        }
        return item;
      });

      dataRef.current = newData;
      setHasChanged(true);
      setEditingKey(null);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const deleteRow = (key: React.Key) => {
    if (handleDelete) {
      handleDelete(key);
    } else {
      const newData = dataRef.current.filter((item) => item.key !== key);
      dataRef.current = newData;
      setHasChanged(true);
    }
  };

  const addRow = () => {
    if (handleAdd) {
      const newItem: Omit<Item, 'key'> = { name: '', quantity: 1, price: 0 };
      handleAdd(newItem);
    }
  };

  const columns: ColumnType<Item & { editable?: boolean }>[] = [
    {
      title: 'Nom',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: 'Quantité',
      dataIndex: 'quantity',
      width: '15%',
      editable: true,
    },
    {
      title: 'Prix unitaire',
      dataIndex: 'price',
      width: '15%',
      editable: true,
    },
    {
      title: 'Opérations',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Sauvegarder
            </a>
            <Popconfirm title="Annuler ?" onConfirm={cancel}>
              <a>Annuler</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <button
              disabled={editingKey !== null}
              onClick={() => edit(record)}
              style={{
                marginRight: 8,
                background: 'none',
                border: 'none',
                color: '#1890ff',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Modifier
            </button>
            <Popconfirm
              title="Supprimer ?"
              onConfirm={() => deleteRow(record.key)}
            >
              <a>Supprimer</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!(col as ColumnType<Item & { editable?: boolean }>).editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => {
        const column = col as ColumnType<Item & { editable?: boolean }>;
        return {
          record,
          inputType:
            (col as ColumnType<Item & { editable?: boolean }>).dataIndex ===
              'quantity' ||
            (col as ColumnType<Item & { editable?: boolean }>).dataIndex ===
              'price'
              ? 'number'
              : 'text',
          dataIndex: column.dataIndex,
          title: column.title,
          editing: isEditing(record),
        };
      },
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={dataSource}
        columns={mergedColumns as ColumnType<Item>[]}
        rowClassName="editable-row"
        pagination={false}
        footer={() => (
          <div style={{ textAlign: 'right' }}>
            <button onClick={addRow}>Ajouter</button>
          </div>
        )}
      />
    </Form>
  );
};

interface EditableCellProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: string;
  editable: boolean;
  children: ReactNode;
  record: Item;
  inputType: 'number' | 'text';
  dataIndex: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  record,
  inputType,
  dataIndex,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input | null>(null);
  const numberInputRef = useRef<InputNumber | null>(null);
  const form = Form.useFormInstance();

  useEffect(() => {
    if (editing) {
      if (inputType === 'text' && inputRef.current) {
        inputRef.current.focus();
      } else if (inputType === 'number' && numberInputRef.current) {
        numberInputRef.current.focus();
      }
    }
  }, [editing, inputType]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex as keyof Item] });
  };

  const save = async () => {
    try {
      await form.validateFields();
      toggleEdit();
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Veuillez saisir ${title} !`,
          },
        ]}
      >
        {inputType === 'number' ? (
          <InputNumber
            ref={numberInputRef}
            onPressEnter={save}
            onBlur={save}
            style={{ width: '100%' }}
          />
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableTable;

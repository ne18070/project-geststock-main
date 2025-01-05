'use client';

import {
  Form,
  Select,
  Button,
  Table,
  InputNumber,
  Space,
  Card,
  Modal,
  Checkbox,
  message,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/app/hooks/useApi';


const StockAndPromo = ({ stock, promoQuantity }: { stock: number; promoQuantity: number }) => (
  <div>
    <span className="text-sm">Stock: {stock}</span>
    {promoQuantity > 0 && <span className="text-sm"> | Promo: {promoQuantity}</span>}
  </div>
);

interface Product {
  id: number;
  name: string;
  stock: number;
  promoQuantity: number;
  promoPrice: number | null;
}
interface Client {
    id: number;
    name: string;
}

interface Agent {
  id: number;
  name: string;
  clients: Client[]
}


export default function NouvelleCommandePage() {
    const { data: session } = useSession();
    const userRole = session?.user?.role || 'user';
     const [messageApi, contextHolder] = message.useMessage();


  const [form] = Form.useForm();
    const [products, setProducts] = useState<{ id: number; produit: string; quantite: number; prixUnitaire: number; promo: boolean; promoQuantity: number; originalPrice: number; maxQuantity: number }[]>([]);
  const [productIdCounter, setProductIdCounter] = useState(1);
     const [initialProducts, setInitialProducts] = useState<Product[]>([]);
      const [agents, setAgents] = useState<Agent[]>([]);
     const [clients, setClients] = useState<Client[]>([]);
     const [selectedAgent, setSelectedAgent] = useState<number | null>(null)

  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [currentPromoProduct, setCurrentPromoProduct] = useState<{
    value: string;
    label: string;
    stock: number;
    promoQuantity: number;
    promoPrice: number | null;
  } | null>(null);
  const [promoAmount, setPromoAmount] = useState(0);
  const [usePromo, setUsePromo] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const productsData = await api.get<Product[]>('/products', { useToken: true});
                const agentsData = await api.get<Agent[]>('/agents', { useToken: true});
                 setInitialProducts(productsData);
                setAgents(agentsData)
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                 messageApi.open({
                    type: 'error',
                    content: `Failed to load data`,
                });
            }
        };

        fetchInitialData();

    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  useEffect(() => {
      if(selectedAgent){
          const agent = agents.find(agent => agent.id === selectedAgent);
           if(agent){
               setClients(agent.clients);
           } else {
               setClients([])
           }
      } else {
          setClients([])
      }

  }, [selectedAgent, agents])

  const handlePromoModalCancel = () => {
    setPromoModalVisible(false);
    setCurrentPromoProduct(null);
    setUsePromo(false);
    setPromoAmount(0);
  };

  const handlePromoModalOk = () => {
    if (currentPromoProduct && selectedQuantity) {
      if (usePromo) {
        addProductToCart(
          currentPromoProduct,
          selectedQuantity,
          true,
          promoAmount,
        );
      } else {
        addProductToCart(currentPromoProduct, selectedQuantity, false, 0);
      }
    }
    handlePromoModalCancel();
  };

  const columns = [
        {
            title: 'Produit',
            dataIndex: 'produit',
            key: 'produit',
            width: '25%',
        },
        {
            title: 'Quantité',
            dataIndex: 'quantite',
            key: 'quantite',
            width: '20%',
            render: (_: unknown, record: { quantite: number; maxQuantity: number }, index: number) => (
                <InputNumber
                    min={1}
                    max={record.maxQuantity}
                    value={record.quantite}
                    onChange={(value) => handleQuantityChange(index, value)}
                    className="w-full"
                />
            ),
        },
        {
            title: 'Prix',
            dataIndex: 'prixUnitaire',
            key: 'prixUnitaire',
            width: '15%',
            render: (prix: number) => <span className="text-xs">{`${prix.toFixed(2)} Fcfa`}</span>,
        },
        {
            title: 'Promo',
            dataIndex: 'promoQuantity',
            key: 'promoQuantity',
            width: '10%',
            render: (promoQuantity: number) =>
                promoQuantity > 0 ? (
                    <span className="text-green-500 text-xs">{promoQuantity}</span>
                ) : (
                  <span className="text-xs">-</span>
                ),
        },
        {
            title: 'Total',
            key: 'total',
            width: '15%',
            render: (record: { quantite: number; prixUnitaire: number }) => {
                const total = record.quantite * record.prixUnitaire;
                return <span className="text-xs">{`${total.toFixed(2)} Fcfa`}</span>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            render: (_: unknown, __: unknown, index: number) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveProduct(index)}
                    size="small"
                />
            ),
        },
    ];


  const handleQuantityChange = (index: number, value: number | null) => {
    if (!value) return;

    const newProducts = [...products];
    const product = newProducts[index];
    const maxQuantity = product.promo
      ? product.promoQuantity
      : product.maxQuantity;


    if (value <= maxQuantity) {
       // Update the quantite of the product in the table
       product.quantite = value;
       setProducts(newProducts);
     } else {
      messageApi.open({
           type: 'warning',
           content: `La quantité maximale disponible pour ${product.produit} est de ${maxQuantity}`,
       });
    }
  };

  const handleRemoveProduct = (index: number) => {
    const removedProduct = products[index];
    const newProducts = products.filter((_, i) => i !== index);
    // Restore stock
    const updatedInitialProducts = initialProducts.map((product) => {
      if (product.name === removedProduct.produit) {
        return {
          ...product,
          stock: product.stock + removedProduct.quantite,
          promoQuantity:
            product.promoQuantity +
            (removedProduct.promo ? removedProduct.promoQuantity : 0),
        };
      }
      return product;
    });

    setInitialProducts(updatedInitialProducts);
    setProducts(newProducts);
  };

   const handleAddProduct = () => {
        const values = form.getFieldValue('newProduct');
        if (!values?.produit) return;

        const selectedProduct = initialProducts.find(
            (prod) => prod.name === values.produit,
        );
        if (!selectedProduct) return;


        const quantity = values?.quantite || 1;
       setSelectedQuantity(quantity);


       const maxAllowedQuantity = selectedProduct.stock;
       const maxAllowedPromoQuantity = selectedProduct.promoQuantity;


       if(quantity > maxAllowedQuantity) {
             messageApi.open({
                    type: 'warning',
                    content: `La quantité maximale disponible pour ${selectedProduct.name} est de ${maxAllowedQuantity}`,
                });
           return
       }


        if (selectedProduct.promoQuantity > 0 && userRole === 'secretary') {
           if(quantity > maxAllowedPromoQuantity) {
               setPromoModalVisible(true);
               setCurrentPromoProduct(selectedProduct);
               setPromoAmount(maxAllowedPromoQuantity);
               setUsePromo(true);
           }else{
               setPromoModalVisible(true);
               setCurrentPromoProduct(selectedProduct);
               setPromoAmount(quantity);
               setUsePromo(true);
           }
        } else {
             addProductToCart(selectedProduct, quantity, false, 0);
        }
        form.resetFields(['newProduct']);
    };


    const addProductToCart = (
        selectedProduct: { value: string; label: string; stock: number; promoQuantity: number; promoPrice: number | null },
        quantity: number,
        isPromo = false,
        promoQuantity = 0,
    ) => {
        const price = isPromo && selectedProduct.promoPrice !== null ? selectedProduct.promoPrice : 10;
        const newProduct = {
            id: productIdCounter,
            produit: selectedProduct.value,
            quantite: quantity,
            prixUnitaire: price,
            promo: isPromo,
            promoQuantity: promoQuantity,
            originalPrice: 10,
            maxQuantity: isPromo ? promoQuantity : selectedProduct.stock,
        };
        setProductIdCounter((prev) => prev + 1);

        // Update stock in initialProducts
        const updatedProducts = initialProducts.map((product) => {
            if (product.name === selectedProduct.value) {
                return {
                    ...product,
                    stock: product.stock - quantity,
                    promoQuantity: isPromo
                        ? product.promoQuantity - promoQuantity
                        : product.promoQuantity,
                };
            }
            return product;
        });

        setInitialProducts(updatedProducts);
        setProducts([...products, newProduct]);
    };

  const totalAmount = useMemo(() => {
    return products.reduce(
      (acc, product) => acc + product.quantite * product.prixUnitaire,
      0,
    );
  }, [products]);


  const renderMobileTable = () => {
      return (
          <div className="space-y-4">
              {products.map((record, index) => (
                  <div key={record.id} className="border rounded p-4">
                      <div className="flex justify-between">
                          <span className="font-bold">Produit:</span>
                          <span>{record.produit}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="font-bold">Quantité:</span>
                         <InputNumber
                            min={1}
                            max={record.maxQuantity}
                            value={record.quantite}
                            onChange={(value) => handleQuantityChange(index, value)}
                            className="w-20"
                        />
                      </div>
                      <div className="flex justify-between">
                          <span className="font-bold">Prix unitaire:</span>
                         <span className="text-xs">{`${record.prixUnitaire.toFixed(2)} Fcfa`}</span>
                      </div>
                       <div className="flex justify-between">
                        <span className="font-bold">Promo :</span>
                        {record.promoQuantity > 0 ? <span className="text-green-500 text-xs">{record.promoQuantity}</span> : <span className="text-xs">-</span>}
                        </div>
                      <div className="flex justify-between">
                          <span className="font-bold">Total:</span>
                           <span className="text-xs">{`${(record.quantite * record.prixUnitaire).toFixed(2)} Fcfa`}</span>
                      </div>
                      <div className="text-right mt-2">
                          <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveProduct(index)}
                              size="small"
                          />
                      </div>
                  </div>
              ))}
          </div>
      );
  };


    const handleAgentChange = (value: number | undefined) => {
      if(value) {
        setSelectedAgent(value)
      }else{
        setSelectedAgent(null)
      }
    }

    return (
        <div className="space-y-4 p-2">
            {contextHolder}
            <h1 className="text-xl font-bold mb-4">Nouvelle Commande</h1>

            <Card title={<span className="text-lg">Informations client</span>}>
                <Form layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Client"
                            name="client"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Sélectionner un client"
                                options={clients.map((client) => ({
                                    value: client.id,
                                    label: client.name
                                }))}
                                disabled={!selectedAgent}
                            />
                        </Form.Item>

                        <Form.Item label="Agent" name="agent" rules={[{ required: true }]}>
                            <Select
                                placeholder="Sélectionner un agent"
                                options={agents.map((agent) => ({
                                  value: agent.id,
                                  label: agent.name
                                }))}
                                onChange={handleAgentChange}
                            />
                        </Form.Item>
                    </div>
                </Form>
            </Card>

            <Card title={<span className="text-lg">Produits</span>}>
                <Form form={form} layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Form.Item name={['newProduct', 'produit']} label="Produit">
                            <Select
                                placeholder="Sélectionner un produit"
                                options={initialProducts.map((prod) => ({
                                    value: prod.name,
                                    label: (
                                        <div className="flex justify-between">
                                            <div>{prod.name}</div>
                                            <StockAndPromo
                                                stock={prod.stock}
                                                promoQuantity={prod.promoQuantity}
                                            />
                                        </div>
                                    ),
                                    disabled: prod.stock === 0,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name={['newProduct', 'quantite']}
                            label="Quantité"
                            initialValue={1}
                        >
                            <InputNumber min={1} className="w-full" />
                        </Form.Item>

                        <Form.Item label=" " className="flex items-end">
                            <Button type="primary" onClick={handleAddProduct} className="w-full md:w-auto">
                                Ajouter
                            </Button>
                        </Form.Item>
                    </div>
                </Form>

          {userRole === 'secretary' ? (
                    <Modal
                      title="Promotion disponible"
                      open={promoModalVisible}
                      onOk={handlePromoModalOk}
                      onCancel={handlePromoModalCancel}
                      width={350}
                    >
                        <div className="space-y-4">
                            <p>
                                Quantité de promotion disponible:{' '}
                                {currentPromoProduct?.promoQuantity}
                            </p>
                            <p>
                                Prix promotionnel:{' '}
                                {currentPromoProduct?.promoPrice?.toFixed(2)} Fcfa
                            </p>
                            <div>
                                <label className="block mb-2">
                                    Quantité en promotion:
                                </label>
                                <InputNumber
                                    min={0}
                                    max={Math.min(
                                        currentPromoProduct?.promoQuantity || 0,
                                        selectedQuantity,
                                    )}
                                    value={promoAmount}
                                    onChange={(value) => setPromoAmount(value || 0)}
                                    className="w-full"
                                />
                            </div>
                            <Checkbox
                                checked={usePromo}
                                onChange={(e) => setUsePromo(e.target.checked)}
                            >
                                Appliquer la promotion
                            </Checkbox>
                        </div>
                  </Modal>
          ) : (
          <></>
          )}


        {isMobile ? (
          renderMobileTable()
        ) : (
            <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={products}
                  pagination={false}
                  rowKey="id"
                  size="small"
                />
          </div>
        )}
                <div className="mt-4 text-right">
                    <div className="text-xl font-bold">
                        Total: {totalAmount.toFixed(2)} Fcfa
                    </div>
                    <Space>
                        <Button>Annuler</Button>
                        <Button type="primary">Enregistrer</Button>
                    </Space>
                </div>
            </Card>
        </div>
    );
}
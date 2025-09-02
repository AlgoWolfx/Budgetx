import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBudgetStore } from '@/store/budgetStore';
import { ExpenseTemplate, ExpenseCategory } from '@/types';
import { Plus, Zap, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickExpensePanelProps {
  // Removed onAddExpenseClick prop since we're moving the button
}

export const QuickExpensePanel = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ExpenseTemplate | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [showQuickDialog, setShowQuickDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ExpenseTemplate | null>(null);
  const [showPriceEditModal, setShowPriceEditModal] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: '' as ExpenseCategory | '',
    description: '',
    defaultAmount: '',
    hasQuantity: false,
    unit: '',
    icon: ''
  });
  
  const { getExpenseTemplates, addExpenseFromTemplate, updateExpenseTemplate, addExpenseTemplate, getAvailableCategories } = useBudgetStore();
  const { toast } = useToast();
  const templates = getExpenseTemplates();
  const availableCategories = getAvailableCategories();

  const handlePriceEditClick = (template: ExpenseTemplate) => {
    setEditingTemplate(template);
    setNewPrice(template.defaultAmount?.toString() || '');
    setShowPriceEditModal(true);
  };

  const handlePriceUpdate = () => {
    if (!editingTemplate) return;

    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Geçersiz fiyat",
        description: "Lütfen geçerli bir fiyat girin.",
        variant: "destructive"
      });
      return;
    }

    updateExpenseTemplate(editingTemplate.id, { defaultAmount: price });
    
    toast({
      title: "Fiyat güncellendi",
      description: `${editingTemplate.name} fiyatı €${price.toFixed(2)} olarak güncellendi.`,
    });

    setShowPriceEditModal(false);
    setEditingTemplate(null);
  };

  const handleQuickAdd = (template: ExpenseTemplate, event?: React.MouseEvent) => {
    // Ctrl/Cmd + Click = Fiyat düzenleme modalı aç
    if (event && (event.ctrlKey || event.metaKey)) {
      handlePriceEditClick(template);
      return;
    }
    
    // Sağ tık = Detaylı giriş için ana modalı aç (bu özellik kaldırıldı)
    if (event && event.button === 2) {
      event.preventDefault();
      // onAddExpenseClick?.(); // Bu özellik artık yok
      return;
    }
    
    // Normal tık = Fiyat giriş dialogı aç
    setSelectedTemplate(template);
    setCustomAmount(template.defaultAmount?.toString() || '');
    setQuantity('1');
    setShowQuickDialog(true);
  };

  const handleConfirmQuickAdd = () => {
    if (!selectedTemplate) return;

    const amount = parseFloat(customAmount);
    const qty = selectedTemplate.hasQuantity ? parseInt(quantity) : undefined;

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Geçersiz miktar",
        description: "Lütfen geçerli bir miktar girin.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTemplate.hasQuantity && (!qty || qty <= 0)) {
      toast({
        title: "Geçersiz adet",
        description: "Lütfen geçerli bir adet girin.",
        variant: "destructive"
      });
      return;
    }

    addExpenseFromTemplate(selectedTemplate.id, amount, qty);
    
    const totalAmount = selectedTemplate.hasQuantity && qty ? amount * qty : amount;
    toast({
      title: "Hızlı gider eklendi",
      description: `${selectedTemplate.name} ${qty ? `(${qty} ${selectedTemplate.unit})` : ''} - €${totalAmount.toFixed(2)} eklendi.`,
    });

    setShowQuickDialog(false);
    setSelectedTemplate(null);
  };

  const handleNewTemplate = () => {
    setShowNewTemplateModal(true);
  };

  const resetNewTemplate = () => {
    setNewTemplate({
      name: '',
      category: '',
      description: '',
      defaultAmount: '',
      hasQuantity: false,
      unit: '',
      icon: ''
    });
  };

  const handleCreateTemplate = () => {
    // Validation
    if (!newTemplate.name.trim()) {
      toast({
        title: "Geçersiz isim",
        description: "Lütfen şablon adını girin.",
        variant: "destructive"
      });
      return;
    }

    if (!newTemplate.category) {
      toast({
        title: "Kategori seçin",
        description: "Lütfen bir kategori seçin.",
        variant: "destructive"
      });
      return;
    }

    if (!newTemplate.description.trim()) {
      toast({
        title: "Açıklama gerekli",
        description: "Lütfen şablon açıklaması girin.",
        variant: "destructive"
      });
      return;
    }

    const defaultAmount = newTemplate.defaultAmount ? parseFloat(newTemplate.defaultAmount) : undefined;
    if (newTemplate.defaultAmount && (isNaN(defaultAmount!) || defaultAmount! <= 0)) {
      toast({
        title: "Geçersiz fiyat",
        description: "Lütfen geçerli bir varsayılan fiyat girin.",
        variant: "destructive"
      });
      return;
    }

    if (newTemplate.hasQuantity && !newTemplate.unit.trim()) {
      toast({
        title: "Birim gerekli",
        description: "Adet/miktar için birim belirtmelisiniz (örn: adet, kg, litre).",
        variant: "destructive"
      });
      return;
    }

    // Create template
    const templateData = {
      name: newTemplate.name.trim(),
      category: newTemplate.category as ExpenseCategory,
      description: newTemplate.description.trim(),
      defaultAmount,
      hasQuantity: newTemplate.hasQuantity,
      unit: newTemplate.hasQuantity ? newTemplate.unit.trim() : undefined,
      isRecurring: false, // Default to false, can be updated later
      icon: newTemplate.icon.trim() || '💰'
    };

    addExpenseTemplate(templateData);
    
    toast({
      title: "Şablon oluşturuldu",
      description: `${newTemplate.name} şablonu başarıyla eklendi.`,
    });

    setShowNewTemplateModal(false);
    resetNewTemplate();
  };

  return (
    <>
      <Card className="bg-card border-card-border rounded-xl shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Hızlı Gider Ekleme</span>
            </CardTitle>
          </div>
          <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
            <strong>Kullanım:</strong> Sol tık = Fiyat girişi | <kbd className="bg-muted px-1 rounded">Ctrl + Tık</kbd> = Fiyat düzenle
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {templates.map((template) => {
              return (
                <div key={template.id} className="relative">
                  <Button
                    onClick={(e) => handleQuickAdd(template, e)}
                    onContextMenu={(e) => handleQuickAdd(template, e)}
                    variant="outline"
                    className="h-auto p-3 w-full flex flex-col items-center space-y-2 transition-all hover:bg-primary/10 hover:border-primary/30 relative group"
                    title="Sol tık: Fiyat girişi | Ctrl+tık: Fiyat düzenle"
                  >
                    <div className="text-2xl">{template.icon || '💰'}</div>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary/20 text-primary text-xs px-1 py-0.5 rounded text-[10px]">
                        Ctrl+✓
                      </div>
                    </div>
                    <div className="text-xs text-center">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-muted-foreground flex items-center justify-center">
                        €{template.defaultAmount || 0}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePriceEditClick(template);
                          }}
                          className="ml-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
                          title="Fiyatı düzenle"
                        >
                          <Edit2 className="h-2 w-2" />
                        </Button>
                      </div>
                    </div>
                  </Button>
                </div>
              );
            })}
            
            {/* Yeni şablon ekle butonu */}
            <Button
              onClick={handleNewTemplate}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center space-y-2 border-dashed hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              <Plus className="h-6 w-6 text-primary" />
              <div className="text-xs text-primary font-medium">Yeni Şablon</div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fiyat düzenleme modalı */}
      <Dialog open={showPriceEditModal} onOpenChange={setShowPriceEditModal}>
        <DialogContent className="bg-card-elevated border-card-border max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl flex items-center space-x-2">
              <span className="text-2xl">{editingTemplate?.icon || '💰'}</span>
              <span>{editingTemplate?.name} Fiyat Düzenle</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Yeni Fiyat</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="pl-8 bg-input border-input-border text-foreground rounded-lg"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">
                <strong>Şablon:</strong> {editingTemplate?.name}<br />
                <strong>Mevcut fiyat:</strong> €{editingTemplate?.defaultAmount || 0}<br />
                <strong>Yeni fiyat:</strong> €{parseFloat(newPrice) || 0}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPriceEditModal(false)}
              className="flex-1 border-border text-foreground hover:bg-muted rounded-lg"
            >
              İptal
            </Button>
            <Button
              onClick={handlePriceUpdate}
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg"
            >
              Güncelle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hızlı ekleme dialog'u */}
      <Dialog open={showQuickDialog} onOpenChange={setShowQuickDialog}>
        <DialogContent className="bg-card-elevated border-card-border max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl flex items-center space-x-2">
              <span className="text-2xl">{selectedTemplate?.icon || '💰'}</span>
              <span>{selectedTemplate?.name} Ekle</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">
                {selectedTemplate?.hasQuantity ? 'Birim Fiyat' : 'Miktar'}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-8 bg-input border-input-border text-foreground rounded-lg"
                />
              </div>
            </div>

            {selectedTemplate?.hasQuantity && (
              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  Adet ({selectedTemplate.unit || 'adet'})
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-input border-input-border text-foreground rounded-lg"
                />
              </div>
            )}

            {selectedTemplate?.hasQuantity && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm text-foreground">
                  <strong>Toplam: €{(parseFloat(customAmount) * parseInt(quantity) || 0).toFixed(2)}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowQuickDialog(false)}
              className="flex-1 border-border text-foreground hover:bg-muted rounded-lg"
            >
              İptal
            </Button>
            <Button
              onClick={handleConfirmQuickAdd}
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg"
            >
              Ekle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Yeni şablon oluşturma modalı */}
      <Dialog open={showNewTemplateModal} onOpenChange={(open) => {
        setShowNewTemplateModal(open);
        if (!open) resetNewTemplate();
      }}>
        <DialogContent className="bg-card-elevated border-card-border max-w-lg rounded-xl max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl flex items-center space-x-2">
              <Plus className="h-6 w-6 text-primary" />
              <span>Yeni Şablon Oluştur</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Şablon Adı */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Şablon Adı *</Label>
              <Input
                placeholder="Örn: Kahve, Market Alışverişi"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="bg-input border-input-border text-foreground rounded-lg"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Kategori *</Label>
              <Select 
                value={newTemplate.category} 
                onValueChange={(value: ExpenseCategory) => setNewTemplate({ ...newTemplate, category: value })}
              >
                <SelectTrigger className="bg-input border-input-border text-foreground rounded-lg">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent className="bg-card-elevated border-border rounded-lg">
                  {availableCategories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="text-foreground hover:bg-muted focus:bg-muted"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Açıklama */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Açıklama *</Label>
              <Textarea
                placeholder="Şablon açıklaması girin"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="bg-input border-input-border text-foreground resize-none rounded-lg"
                rows={2}
              />
            </div>

            {/* İcon */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">İkon (emoji)</Label>
              <div className="grid grid-cols-7 gap-2 p-3 bg-muted/20 border border-border rounded-lg">
                {/* Predefined emojis from category mapping */}
                {[
                  '🛒', '🚗', '📱', '🏠', '💪', '📺', '📈', 
                  '🏥', '📚', '👕', '💻', '🍽️', '☕', '⛽',
                  '🧽', '💄', '🚬', '🍺', '🎁', '✈️', '💰'
                ].map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setNewTemplate({ ...newTemplate, icon: emoji })}
                    className={`
                      w-10 h-10 rounded-lg border transition-all duration-200
                      flex items-center justify-center text-xl hover:scale-110
                      ${
                        newTemplate.icon === emoji
                          ? 'border-primary bg-primary/10 shadow-md scale-105'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }
                    `}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Şablonunuz için bir emoji seçin
              </p>
            </div>

            {/* Varsayılan Fiyat */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Varsayılan Fiyat</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newTemplate.defaultAmount}
                  onChange={(e) => setNewTemplate({ ...newTemplate, defaultAmount: e.target.value })}
                  className="pl-8 bg-input border-input-border text-foreground rounded-lg"
                />
              </div>
            </div>

            {/* Adet/Miktar Seçenekleri */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasQuantity"
                  checked={newTemplate.hasQuantity}
                  onChange={(e) => setNewTemplate({ ...newTemplate, hasQuantity: e.target.checked, unit: e.target.checked ? newTemplate.unit : '' })}
                  className="rounded border-border"
                />
                <Label htmlFor="hasQuantity" className="text-foreground font-medium">
                  Adet/miktar girişi gereksin
                </Label>
              </div>
              
              {newTemplate.hasQuantity && (
                <div className="space-y-2 ml-6">
                  <Label className="text-foreground font-medium">Birim *</Label>
                  <Input
                    placeholder="adet, kg, litre, paket vs."
                    value={newTemplate.unit}
                    onChange={(e) => setNewTemplate({ ...newTemplate, unit: e.target.value })}
                    className="bg-input border-input-border text-foreground rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Önizleme */}
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">Önizleme:</h4>
              <div className="flex items-center space-x-3 p-3 bg-card border border-card-border rounded-lg">
                <div className="text-2xl">{newTemplate.icon || '💰'}</div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{newTemplate.name || 'Şablon Adı'}</div>
                  <div className="text-sm text-muted-foreground">
                    {newTemplate.category || 'Kategori'} • €{newTemplate.defaultAmount || '0.00'}
                    {newTemplate.hasQuantity && newTemplate.unit && ` / ${newTemplate.unit}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setShowNewTemplateModal(false)}
              className="flex-1 border-border text-foreground hover:bg-muted rounded-lg"
            >
              İptal
            </Button>
            <Button
              onClick={handleCreateTemplate}
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg"
            >
              Şablon Oluştur
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBudgetStore } from '@/store/budgetStore';
import { Expense, ExpenseCategory } from '@/types';
import { Plus, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
}

export const AddExpenseModal = ({ 
  isOpen, 
  onClose, 
  editingExpense 
}: AddExpenseModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    category: '' as ExpenseCategory | '',
    description: '',
    amount: '',
    quantity: '',
    unit: '',
    hasQuantity: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [keepModalOpen, setKeepModalOpen] = useState(false);
  
  const { addExpense, updateExpense, selectedMonth, getAvailableCategories, addCustomCategory } = useBudgetStore();
  const { toast } = useToast();
  const availableCategories = getAvailableCategories();

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    const [currentYear, currentMonth] = selectedMonth.split('-');
    const monthStartDate = `${currentYear}-${currentMonth}-01`;
    
    setFormData({
      date: today >= monthStartDate ? today : monthStartDate,
      category: '',
      description: '',
      amount: '',
      quantity: '',
      unit: '',
      hasQuantity: false,
    });
    setShowNewCategoryInput(false);
    setNewCategoryName('');
  };

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        date: editingExpense.date,
        category: editingExpense.category,
        description: editingExpense.description,
        amount: editingExpense.amount.toString(),
        quantity: editingExpense.quantity?.toString() || '',
        unit: editingExpense.unit || '',
        hasQuantity: !!editingExpense.quantity,
      });
      setKeepModalOpen(false);
    } else {
      resetForm();
    }
  }, [editingExpense, isOpen, selectedMonth]);

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      const categoryName = newCategoryName.trim();
      if (!availableCategories.includes(categoryName)) {
        addCustomCategory(categoryName);
        setFormData({ ...formData, category: categoryName });
        toast({
          title: "Kategori eklendi",
          description: `'${categoryName}' kategorisi başarıyla eklendi.`,
        });
      } else {
        toast({
          title: "Kategori mevcut",
          description: "Bu kategori zaten mevcut.",
          variant: "destructive"
        });
      }
      setShowNewCategoryInput(false);
      setNewCategoryName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const baseAmount = parseFloat(formData.amount);
      const qty = formData.hasQuantity ? parseInt(formData.quantity) : undefined;
      const finalAmount = formData.hasQuantity && qty ? baseAmount * qty : baseAmount;
      
      const expenseData = {
        date: formData.date,
        category: formData.category as ExpenseCategory,
        description: formData.hasQuantity && qty 
          ? `${formData.description} (${qty} ${formData.unit || 'adet'})`
          : formData.description,
        amount: finalAmount,
        quantity: qty,
        unit: formData.unit || undefined,
      };

      if (editingExpense) {
        updateExpense(editingExpense.id, expenseData);
        toast({
          title: "Gider güncellendi",
          description: "Gideriniz başarıyla güncellendi.",
        });
        onClose();
      } else {
        addExpense(expenseData);
        toast({
          title: "Gider eklendi",
          description: "Yeni gideriniz başarıyla eklendi.",
        });
        
        if (keepModalOpen) {
          resetForm();
        } else {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        title: "Hata",
        description: "Gider kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.date &&
      formData.category &&
      formData.description.trim() &&
      formData.amount &&
      !isNaN(parseFloat(formData.amount)) &&
      parseFloat(formData.amount) > 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-elevated border-card-border max-w-lg rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            {editingExpense ? 'Gideri Düzenle' : 'Yeni Gider Ekle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground font-medium">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-input border-input-border text-foreground rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground font-medium">
                {formData.hasQuantity ? 'Birim Fiyat' : 'Miktar'}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="pl-8 bg-input border-input-border text-foreground rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Adet/Miktar Sistemi */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasQuantity"
                checked={formData.hasQuantity}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  hasQuantity: e.target.checked,
                  quantity: e.target.checked ? formData.quantity || '1' : '',
                  unit: e.target.checked ? formData.unit || 'adet' : ''
                })}
                className="rounded border-border"
              />
              <Label htmlFor="hasQuantity" className="text-sm text-foreground">
                Adet/Miktar bazlı takip et
              </Label>
            </div>

            {formData.hasQuantity && (
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Adet/Miktar</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="bg-input border-input-border text-foreground rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Birim</Label>
                  <Input
                    placeholder="adet, paket, kutu..."
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="bg-input border-input-border text-foreground rounded-lg"
                  />
                </div>
                
                {formData.amount && formData.quantity && (
                  <div className="col-span-2 text-sm text-foreground font-medium">
                    Toplam: €{(parseFloat(formData.amount) * parseInt(formData.quantity) || 0).toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category" className="text-foreground font-medium">Kategori</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                className="text-primary hover:text-primary-hover h-auto p-1"
              >
                <Plus className="h-4 w-4" />
                <span className="text-xs ml-1">Yeni</span>
              </Button>
            </div>
            
            {showNewCategoryInput ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Yeni kategori adı"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-input border-input-border text-foreground rounded-lg flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewCategory();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddNewCategory}
                  size="sm"
                  className="bg-success hover:bg-success-hover text-success-foreground px-3"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryInput(false);
                    setNewCategoryName('');
                  }}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Select 
                value={formData.category} 
                onValueChange={(value: ExpenseCategory) => 
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-input border-input-border text-foreground rounded-lg">
                  <SelectValue placeholder="Bir kategori seçin" />
                </SelectTrigger>
                <SelectContent className="bg-card-elevated border-border rounded-lg">
                  {availableCategories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="text-foreground hover:bg-muted focus:bg-muted rounded-md"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Neye para harcadınız?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-input border-input-border text-foreground resize-none rounded-lg"
              rows={3}
              required
            />
          </div>

          {!editingExpense && (
            <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
              <input
                type="checkbox"
                id="keepOpen"
                checked={keepModalOpen}
                onChange={(e) => setKeepModalOpen(e.target.checked)}
                className="rounded border-border"
              />
              <Label htmlFor="keepOpen" className="text-sm text-foreground">
                Gider ekledikten sonra pencereyi açık tut
              </Label>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border text-foreground hover:bg-muted rounded-lg"
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg"
            >
              {isLoading 
                ? 'Kaydediliyor...' 
                : editingExpense 
                ? 'Gideri Güncelle' 
                : keepModalOpen
                ? 'Ekle ve Devam Et'
                : 'Gider Ekle'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
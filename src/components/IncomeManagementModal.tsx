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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetStore } from '@/store/budgetStore';
import { IncomeEntry } from '@/types';
import { Plus, Edit, Trash2, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IncomeManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
}

export const IncomeManagementModal = ({ 
  isOpen, 
  onClose, 
  month 
}: IncomeManagementModalProps) => {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<IncomeEntry | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    source: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    getMonthIncomeEntries, 
    addIncomeEntry, 
    updateIncomeEntry, 
    deleteIncomeEntry,
    selectedMonth 
  } = useBudgetStore();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const entries = getMonthIncomeEntries(month);
      setIncomeEntries(entries);
      resetForm();
    }
  }, [isOpen, month, getMonthIncomeEntries]);

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    const [currentYear, currentMonth] = month.split('-');
    const monthStartDate = `${currentYear}-${currentMonth}-01`;
    
    setFormData({
      date: today >= monthStartDate ? today : monthStartDate,
      description: '',
      amount: '',
      source: ''
    });
    setShowAddForm(false);
    setEditingEntry(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Geçersiz miktar",
          description: "Lütfen geçerli bir gelir miktarı girin.",
          variant: "destructive"
        });
        return;
      }

      if (!formData.description.trim()) {
        toast({
          title: "Açıklama gerekli",
          description: "Lütfen gelir açıklaması girin.",
          variant: "destructive"
        });
        return;
      }

      const entryData = {
        date: formData.date,
        description: formData.description.trim(),
        amount,
        source: formData.source.trim() || undefined
      };

      if (editingEntry) {
        updateIncomeEntry(month, editingEntry.id, entryData);
        toast({
          title: "Gelir güncellendi",
          description: `${formData.description} başarıyla güncellendi.`,
        });
      } else {
        addIncomeEntry(month, entryData);
        toast({
          title: "Gelir eklendi",
          description: `${formData.description} - €${amount.toFixed(2)} eklendi.`,
        });
      }

      // Refresh entries
      const updatedEntries = getMonthIncomeEntries(month);
      setIncomeEntries(updatedEntries);
      resetForm();
    } catch (error) {
      console.error('Error saving income entry:', error);
      toast({
        title: "Hata",
        description: "Gelir kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry: IncomeEntry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      description: entry.description,
      amount: entry.amount.toString(),
      source: entry.source || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu gelir girişini silmek istediğinizden emin misiniz?')) {
      deleteIncomeEntry(month, id);
      const updatedEntries = getMonthIncomeEntries(month);
      setIncomeEntries(updatedEntries);
      
      toast({
        title: "Gelir silindi",
        description: "Gelir girişi başarıyla silindi.",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('tr-TR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const isFormValid = formData.date && formData.description.trim() && formData.amount && !isNaN(parseFloat(formData.amount)) && parseFloat(formData.amount) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-elevated border-card-border max-w-5xl rounded-xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="sticky top-0 bg-card-elevated/95 backdrop-blur-sm border-b border-border pb-4 z-10">
          <DialogTitle className="text-foreground text-2xl flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-bold">{formatMonthDisplay(month)}</div>
              <div className="text-sm font-normal text-muted-foreground">Gelir Yönetimi</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-1 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-primary/5 via-success/5 to-primary/10 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <span className="text-lg font-semibold">Toplam Gelir</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                    {formatCurrency(totalIncome)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">
                      {incomeEntries.length} gelir girişi
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg text-primary-foreground rounded-xl px-6 py-3 transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Gelir Ekle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="border-primary/30 shadow-md bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-success/5 rounded-t-lg">
                <CardTitle className="text-foreground flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-semibold">{editingEntry ? 'Gelir Düzenle' : 'Yeni Gelir Ekle'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="date" className="text-foreground font-semibold flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Tarih *</span>
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-input border-input-border text-foreground rounded-xl h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="amount" className="text-foreground font-semibold flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span>Miktar *</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold">€</span>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="pl-10 bg-input border-input-border text-foreground rounded-xl h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-foreground font-semibold">Açıklama *</Label>
                    <Input
                      id="description"
                      placeholder="Örn: Aylık maaş, Freelance projesi, Bonus"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-input border-input-border text-foreground rounded-xl h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="source" className="text-foreground font-semibold">Kaynak (Opsiyonel)</Label>
                    <Input
                      id="source"
                      placeholder="Örn: Maaş, Freelance, Bonus, Yatırım"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="bg-input border-input-border text-foreground rounded-xl h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1 border-border text-foreground hover:bg-muted rounded-xl h-12 transition-all duration-200"
                      disabled={isLoading}
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isFormValid || isLoading}
                      className="flex-1 bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg text-primary-foreground rounded-xl h-12 transform hover:scale-105 transition-all duration-200"
                    >
                      {isLoading 
                        ? 'Kaydediliyor...' 
                        : editingEntry 
                        ? 'Güncelle' 
                        : 'Ekle'
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Income Entries Table */}
          <Card className="shadow-md bg-gradient-to-br from-card to-card/95">
            <CardHeader className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-t-lg">
              <CardTitle className="text-foreground flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-semibold">Gelir Girişleri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {incomeEntries.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-success/10 flex items-center justify-center shadow-lg">
                    <DollarSign className="h-10 w-10 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground mb-3 text-lg">Henüz gelir girişi yok</p>
                  <p className="text-muted-foreground mb-6">Bu ay için ilk gelir girişinizi ekleyin</p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg text-primary-foreground rounded-xl px-8 py-3 transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Gelir Girişinizi Ekleyin
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                        <TableRow className="border-border hover:bg-muted/30">
                          <TableHead className="text-foreground font-semibold h-12">Tarih</TableHead>
                          <TableHead className="text-foreground font-semibold h-12">Açıklama</TableHead>
                          <TableHead className="text-foreground font-semibold h-12">Kaynak</TableHead>
                          <TableHead className="text-right text-foreground font-semibold h-12">Miktar</TableHead>
                          <TableHead className="text-right text-foreground font-semibold h-12">Eylemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incomeEntries
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((entry, index) => (
                          <TableRow key={entry.id} className="border-border hover:bg-muted/20 transition-all duration-200 group">
                            <TableCell className="text-foreground font-medium h-14">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span>{formatDate(entry.date)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground h-14">
                              <div className="font-medium">{entry.description}</div>
                            </TableCell>
                            <TableCell className="text-muted-foreground h-14">
                              {entry.source ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                  {entry.source}
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-foreground font-bold h-14">
                              <span className="text-lg">{formatCurrency(entry.amount)}</span>
                            </TableCell>
                            <TableCell className="text-right h-14">
                              <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(entry)}
                                  className="h-9 w-9 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(entry.id)}
                                  className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-border/50 bg-card-elevated/50 backdrop-blur-sm">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border text-foreground hover:bg-muted rounded-xl px-8 py-2 transition-all duration-200"
          >
            Kapat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
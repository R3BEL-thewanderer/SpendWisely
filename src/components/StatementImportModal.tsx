'use client';

import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckSquare,
  FileSpreadsheet,
  FileText,
  Loader2,
  Sparkles,
  Square,
  Upload,
  X,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import {
  convertPreviewsToTransactions,
  generateDemoStatement,
  parseExcelOrCsvStatement,
  parsePdfStatement,
  ParsedTransactionPreview,
} from '../lib/statementParser';

export function StatementImportModal() {
  const { activeModal, closeModal, categories, importTransactionsBatch, showToast } =
    useSpendWise();

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previews, setPreviews] = useState<ParsedTransactionPreview[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (activeModal !== 'IMPORT_STATEMENT') return null;

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);
    setFileName(file.name);

    try {
      const lower = file.name.toLowerCase();
      let parsed: ParsedTransactionPreview[] = [];

      if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) {
        parsed = await parseExcelOrCsvStatement(file);
      } else if (lower.endsWith('.pdf')) {
        parsed = await parsePdfStatement(file);
      } else {
        throw new Error('Unsupported format. Please upload an Excel (.xlsx/.xls), CSV, or PDF file.');
      }

      if (parsed.length === 0) {
        throw new Error('No readable transaction rows found in the uploaded statement.');
      }

      setPreviews(parsed);
      showToast(`Extracted ${parsed.length} transactions from ${file.name}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Failed to parse statement document.');
      showToast('Parsing error. Try loading sample statement.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDemoLoad = () => {
    setErrorMessage(null);
    setIsProcessing(true);
    setFileName('Demo_HDFC_Bank_Statement_Oct2026.xlsx');
    setTimeout(() => {
      const sample = generateDemoStatement('HDFC');
      setPreviews(sample);
      setIsProcessing(false);
      showToast(`Loaded ${sample.length} verified sample transactions`);
    }, 400);
  };

  const toggleSelectAll = () => {
    const allSelected = previews.every((p) => p.selected);
    setPreviews(previews.map((p) => ({ ...p, selected: !allSelected })));
  };

  const toggleRow = (id: string) => {
    setPreviews(
      previews.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const updateCategory = (id: string, newCat: string) => {
    setPreviews(
      previews.map((p) => (p.id === id ? { ...p, category: newCat } : p))
    );
  };

  const selectedCount = previews.filter((p) => p.selected).length;
  const totalExpense = previews
    .filter((p) => p.selected && p.type === 'EXPENSE')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalIncome = previews
    .filter((p) => p.selected && p.type === 'INCOME')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleImport = () => {
    const toImport = convertPreviewsToTransactions(previews);
    if (toImport.length === 0) {
      showToast('Please select at least 1 transaction to import');
      return;
    }
    importTransactionsBatch(toImport);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full sm:w-[620px] max-h-[92vh] bg-[#f5f5f5] dark:bg-[#0c0a09] sm:rounded-2xl rounded-t-2xl border border-[#e7e5e4] dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e7e5e4] dark:border-white/5 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#1c1917]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-white/5 border border-[#e7e5e4] dark:border-white/10 flex items-center justify-center text-[#0c0a09] dark:text-white shadow-2xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white">
                Import Bank Statement
              </h2>
              <p className="text-[10px] text-[#777169] tracking-[0.16px]">
                Support for Excel (.xlsx, .xls), CSV, and PDF bank statements
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-[#f0efed] dark:bg-white/5 flex items-center justify-center transition active:scale-95 text-[#0c0a09] dark:text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4 no-scrollbar">
          {/* File Upload Dropzone */}
          {previews.length === 0 && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition cursor-pointer text-center ${
                isDragging
                  ? 'border-[#0c0a09] dark:border-white bg-[#fafafa] dark:bg-white/5'
                  : 'border-[#d6d3d1] dark:border-white/10 bg-white dark:bg-[#181615] hover:border-[#a8a29e]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-12 h-12 rounded-full bg-[#f0efed] dark:bg-white/5 flex items-center justify-center text-[#0c0a09] dark:text-white">
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0c0a09] dark:text-white">
                  {isProcessing
                    ? 'Parsing statement lines & categories...'
                    : 'Upload or drag your bank statement'}
                </h3>
                <p className="text-[11px] text-[#777169] mt-1">
                  Supported formats: Excel (.xlsx, .xls), CSV (.csv), or PDF (.pdf)
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-[#a8a29e] uppercase font-semibold">or</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDemoLoad();
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#f0efed] dark:bg-white/10 hover:bg-[#e7e5e4] text-[#0c0a09] dark:text-white text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Load Sample Verified Statement (HDFC / SBI)</span>
              </button>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Preview Table */}
          {previews.length > 0 && (
            <div className="flex flex-col gap-3">
              {/* Document Banner */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#777169]" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#0c0a09] dark:text-white">
                      {fileName}
                    </h4>
                    <span className="text-[10px] text-[#777169]">
                      {previews.length} total transactions detected
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSelectAll}
                    className="text-xs font-medium text-[#0c0a09] dark:text-white underline hover:opacity-80"
                  >
                    {previews.every((p) => p.selected) ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={() => {
                      setPreviews([]);
                      setFileName(null);
                    }}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline pl-2"
                  >
                    Upload Other
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="border border-[#e7e5e4] dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#181615] max-h-[360px] overflow-y-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#fafafa] dark:bg-white/5 border-b border-[#e7e5e4] dark:border-white/10 text-[10px] font-semibold text-[#777169] uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="p-2.5 w-8 text-center">
                        <button onClick={toggleSelectAll}>
                          {previews.every((p) => p.selected) ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#0c0a09] dark:text-white" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-[#a8a29e]" />
                          )}
                        </button>
                      </th>
                      <th className="p-2.5">Date & Item</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e5e4] dark:divide-white/5">
                    {previews.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => toggleRow(row.id)}
                        className={`cursor-pointer transition hover:bg-[#fafafa] dark:hover:bg-white/5 ${
                          row.selected ? 'bg-transparent' : 'opacity-40'
                        }`}
                      >
                        <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => toggleRow(row.id)}>
                            {row.selected ? (
                              <CheckSquare className="w-3.5 h-3.5 text-[#0c0a09] dark:text-white" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-[#a8a29e]" />
                            )}
                          </button>
                        </td>

                        <td className="p-2.5">
                          <div className="font-semibold text-[#0c0a09] dark:text-white text-xs">
                            {row.cleanTitle}
                          </div>
                          <div className="text-[10px] text-[#777169] truncate max-w-[200px]">
                            {row.rawDescription}
                          </div>
                          <div className="text-[9.5px] text-[#a8a29e] mt-0.5">
                            {row.date} • {row.paymentMethod}
                          </div>
                        </td>

                        <td className="p-2.5" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={row.category}
                            onChange={(e) => updateCategory(row.id, e.target.value)}
                            className="text-[11px] font-medium px-2 py-1 rounded bg-[#f0efed] dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/10 text-[#0c0a09] dark:text-white focus:outline-none"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                            <option value="Salary">Salary</option>
                            <option value="Investments">Investments</option>
                            <option value="Other Income">Other Income</option>
                            <option value="Other Expense">Other Expense</option>
                          </select>
                        </td>

                        <td className="p-2.5 text-right font-mono font-bold">
                          <span
                            className={
                              row.type === 'INCOME'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }
                          >
                            {row.type === 'INCOME' ? '+' : '-'}
                            {formatCurrency(row.amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Action */}
        {previews.length > 0 && (
          <div className="p-4 border-t border-[#e7e5e4] dark:border-white/5 bg-white dark:bg-[#1c1917] flex items-center justify-between flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#0c0a09] dark:text-white">
                {selectedCount} Selected
              </span>
              <div className="flex items-center gap-2 text-[10.5px] text-[#777169] mt-0.5">
                {totalExpense > 0 && (
                  <span className="text-rose-600 dark:text-rose-400">
                    Expense: -{formatCurrency(totalExpense)}
                  </span>
                )}
                {totalIncome > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Income: +{formatCurrency(totalIncome)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleImport}
              disabled={selectedCount === 0}
              className="py-2.5 px-5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-[#0c0a09] text-xs font-semibold flex items-center gap-2 shadow-xs transition active:scale-95 disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Import to Ledger</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

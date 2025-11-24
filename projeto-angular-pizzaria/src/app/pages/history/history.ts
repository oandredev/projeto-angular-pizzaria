import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../core/services/history/history-service';
import { History as HistoryT, CartItem } from '../../core/types/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  historyList: HistoryT[] = []; // Variável para armazenar o histórico do usuário
  isLoading: boolean = true; // Estado de carregamento
  errorMessage: string | null = null; // Mensagem de erro

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.exibirHistorico();
  }

  /**
   * Obtém o histórico de compras do usuário logado através do serviço e popula a historyList.
   */
  exibirHistorico(): void {
    this.isLoading = true;
    this.errorMessage = null;
    console.log('Carregando histórico de compras do usuário...');
    this.historyService.getHistoryByUser().subscribe({
      next: (data: HistoryT[]) => {
        // Sucesso: os dados são recebidos e armazenados na variável
        this.historyList = data;
        this.isLoading = false;
        console.log('Histórico de compras carregado:', this.historyList);
      },
      error: (error: any) => {
        // Erro: armazena a mensagem de erro
        this.errorMessage =
          'Não foi possível carregar o histórico de compras. Verifique a conexão com a API.';
        this.isLoading = false;
        console.error('Erro ao carregar histórico:', error);
      },
      complete: () => {
        console.log('Requisição de histórico finalizada.');
      },
    });
  }

  // Função para formatar as customizações em uma string legível
  getCustomizationsString(item: CartItem): string {
    return item.customizedOffer.selectedCustomizations
      .map((c) => `${c.type}: ${c.name} (R$ ${this.getSafeValue(c.value).toFixed(2)})`)
      .join(' | ');
  }

  /**
   * Função auxiliar para garantir que uma string de valor seja convertida
   * em um número válido (ou 0 se for inválida/nula).
   */
  private getSafeValue(value: string | undefined | null): number {
    if (value === null || value === undefined) {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Função para calcular o valor base + customizações de um item (para referência)
  calculateItemBaseValue(item: CartItem): number {
    // Usa a função auxiliar para garantir que o valor base é um número (usa optional chaining)
    const base = this.getSafeValue(item.customizedOffer?.offer?.priceBase ?? null);

    // Filtra e soma de forma segura os valores de customização (garante array vazio se não existir)
    const customValue = (item.customizedOffer?.selectedCustomizations ?? []).reduce((sum, c) => {
      // Usa a função auxiliar para cada valor de customização
      return sum + this.getSafeValue(c.value);
    }, 0);

    return base + customValue;
  }
}

import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-calculations',
  imports: [CommonModule, TranslateModule],
  templateUrl: './modal-calculations.html',
  styleUrl: './modal-calculations.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalCalculations {
  readonly isOpen = signal(false);
  readonly title = signal('');
  readonly message = signal('');
  readonly isSuccess = signal(true);

  // Output event when modal closes
  readonly closed = output<void>();

  /**
   * Open modal with success message
   */
  openSuccess(title: string, message: string): void {
    this.title.set(title);
    this.message.set(message);
    this.isSuccess.set(true);
    this.isOpen.set(true);
  }

  /**
   * Open modal with error message
   */
  openError(title: string, message: string): void {
    this.title.set(title);
    this.message.set(message);
    this.isSuccess.set(false);
    this.isOpen.set(true);
  }

  /**
   * Close modal and emit closed event
   */
  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }
}

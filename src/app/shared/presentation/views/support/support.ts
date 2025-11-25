import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './support.html',
  styleUrl: './support.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Support {
  /**
   * Form builder service
   * @private
   */
  private readonly fb = new FormBuilder();

  /**
   * Support form
   */
  readonly supportForm: FormGroup = this.fb.group({
    subject: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  /**
   * Modal visibility state
   */
  readonly showModal = signal(false);

  /**
   * Submit support ticket (simulation)
   */
  onSubmit(): void {
    if (this.supportForm.valid) {
      console.log('Support ticket submitted:', this.supportForm.value);
      this.showModal.set(true);
    }
  }

  /**
   * Close modal and reset form
   */
  onCloseModal(): void {
    this.showModal.set(false);
    this.supportForm.reset();
  }
}

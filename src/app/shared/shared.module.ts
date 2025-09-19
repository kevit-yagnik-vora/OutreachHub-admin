import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    ConfirmationModalComponent, // <-- 2. DECLARE it so this module owns it
  ],
  imports: [
    CommonModule, // <-- 3. Import CommonModule so you can use *ngIf in the modal
  ],
  exports: [
    ConfirmationModalComponent, // <-- 4. EXPORT it so other modules can use it
  ],
})
export class SharedModule {}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { attachment } from '../../models/attachment';
import { UTILITY } from '../../utilities/utility';

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrls: ['./document-uploader.component.sass']
})
export class DocumentUploaderComponent implements OnInit {

  attachments: attachment[] = [];
  originalAttachments: attachment[] = [];
  files: FileList = new DataTransfer().files;
  public get isGuestUser(): boolean { return this.m_authService.loggedInUser.isGuest; }

  constructor(
    public dialogRef: MatDialogRef<DocumentUploaderComponent>,
    private m_authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: attachment[] = [],
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.attachments = [...this.data];
    this.originalAttachments = [...this.data];
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onFileChanged(event: any) {
    const files = event.target.files;
    if (files.length === 0) return;
    this.previewFiles(files);

    const inputEl = document.getElementById("uploadImage") as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // Clear the input element
    }
  }

  removeAttachmentById(idToRemove: string): void {
    // Find the index of the attachment with the given ID
    const indexToRemove = this.attachments.findIndex(attachment => attachment.id === idToRemove);
    
    // If the attachment with the given ID is found, remove it from the array
    if (indexToRemove !== -1) {
      // Remove from local array
      const updatedAttachments = this.attachments.filter(attachment => attachment.id !== idToRemove);
      this.attachments = updatedAttachments;
    }
  }

  getFileType(filename: string): string {
    const extension = this.getFileExtension(filename);
    switch (extension) {
      case 'xls':
      case 'xlsx':
        return 'excel';
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'word';
      case 'ppt':
      case 'pptx':
        return 'powerpoint';
      case 'txt':
        return 'txt';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      default:
        return 'unknown';
    }
  }
  

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  private previewFiles(files: FileList) {

    console.log(files);

    const newAttachments: attachment[] = [...this.attachments];
    const existing = this.attachments.map(a => a.name);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      if (existing.includes(file.name)) continue;

      const fileId = UTILITY.GenerateUUID();
      const fileName = file.name;
      const fileType = file.type; // Determine file type based on its name
      const fileSizeInBytes = file.size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

      const newAttachment = new attachment(fileId, fileName, fileType, fileSizeInMB, file, null);

      newAttachments.push(newAttachment);
    }


    // Now you have the new attachments with URLs
    console.log(newAttachments);
    // Add new attachments to existing array of attachments
    this.attachments = [...newAttachments];
  }


}

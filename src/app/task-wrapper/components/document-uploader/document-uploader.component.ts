import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrls: ['./document-uploader.component.sass']
})
export class DocumentUploaderComponent implements OnInit {

  attachments: string[] = [];
  files: FileList = new DataTransfer().files;

  constructor(
    public dialogRef: MatDialogRef<DocumentUploaderComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public attachmentsUrls: string[] = [],
  ) {}

  ngOnInit(): void {
    console.log(this.attachments);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private preview() {
    this.attachmentsUrls
  }

  onFileChanged(event: any) {

    const files: FileList = event.target.files;
    if (files.length === 0) return;
    console.log(files);

    // for (let i = 0; i < files.length; i++) {
    //   const file = files[i];
      
    //   if(!(file.type.startsWith('image/') || file.type === 'application/pdf')) return;
      
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);

    //   reader.onload = (event) => {
    //     const imageUrl = reader.result;
    //     console.log(imageUrl);
        
    //     this.attachments.push(imageUrl as string);
    //   };

    // }

  }

  // itemType(url: string): string {
  //   if ((url.includes('pdf'))) return 'document';
  //   return 'image';
  // }

  // getSafeUrl(url: string): SafeResourceUrl {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }

  // createUrl(file: File): any {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);

  //   reader.onload = (event) => {
  //     return reader.result;
  //   };
  // }

}

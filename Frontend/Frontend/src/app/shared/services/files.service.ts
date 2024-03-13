import { Injectable } from '@angular/core';
import { Observable, AsyncSubject } from 'rxjs';

export interface SelectedFiles {
  name: string;
  file: any;
  base64?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor() { }

  public toBase64(files: File[], selectedFiles: SelectedFiles[]): Observable<SelectedFiles[]> {
    const result = new AsyncSubject<SelectedFiles[]>();
    if (files?.length) {
      Object.keys(files)?.forEach((file, i) => {
        const url = URL.createObjectURL(files[i]);
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          selectedFiles = selectedFiles?.filter(f => f?.name != files[i]?.name);
          selectedFiles.push({ name: files[i]?.name, file: files[i], base64: reader?.result as string, url: url});
          result.next(selectedFiles);
          if (files?.length === (i + 1)) {
            result.complete(); // Hoàn tất toàn bộ quá trình convert, trả về mảng selectedFiles có chứa base64 
          }
        };
      });
      return result;
    } else {
      result.next([]);
      result.complete();
      return result;
    }
  }
}

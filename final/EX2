#include <stdio.h>

int main(){
    FILE* fp;
    int awrite[3]={0,1,2};
    int aread[3];
    char bwrite[3]="ABC";
    char bread[4];
    float cwrite[3]={1.1,1.2,1.3};
    float cread[3];
    
    fp=fopen("a.bin","wb+");
    fwrite(awrite,sizeof(int),3,fp);
    fseek(fp,0,SEEK_SET);
    fread(aread,sizeof(int),3,fp);
    for(int i=0;i<3;i++){
        printf("%d ",aread[i]);
    }
    printf("\n");
    fclose(fp);
    
    fp=fopen("a.bin","wb+");
    fwrite(bwrite,sizeof(char),3,fp);
    fseek(fp,0,SEEK_SET);
    fread(bread,sizeof(char),3,fp);
    for(int i=0;i<3;i++){
        printf("%c ",bread[i]);
    }
    printf("\n");
    fclose(fp);
    
    fp=fopen("a.bin","wb+");
    fwrite(cwrite,sizeof(float),3,fp);
    fseek(fp,0,SEEK_SET);
    fread(cread,sizeof(float),3,fp);
    for(int i=0;i<3;i++){
        printf("%f ",cread[i]);
    }
    fclose(fp);
    
    
    
    
    
    
    
    return 0;
}

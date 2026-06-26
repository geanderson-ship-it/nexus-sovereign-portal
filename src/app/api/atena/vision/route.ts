import { NextRequest, NextResponse } from 'next/server';
import { 
  RekognitionClient, 
  CreateCollectionCommand, 
  IndexFacesCommand, 
  SearchFacesByImageCommand 
} from "@aws-sdk/client-rekognition";

const awsConfig = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

const rekognition = new RekognitionClient(awsConfig);
const COLLECTION_ID = "AtenaFaces";

export async function POST(req: NextRequest) {
  try {
    const { action, imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return NextResponse.json({ error: "Nenhuma imagem enviada." }, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    
    // Tenta criar a coleção caso não exista
    try {
      await rekognition.send(new CreateCollectionCommand({ CollectionId: COLLECTION_ID }));
    } catch (e: any) {
      if (e.name !== "ResourceAlreadyExistsException") {
        console.warn("Erro ao verificar/criar coleção:", e.message);
      }
    }

    if (action === 'register') {
      const indexCommand = new IndexFacesCommand({
        CollectionId: COLLECTION_ID,
        Image: { Bytes: buffer },
        ExternalImageId: "Mamae_Ivoni",
        MaxFaces: 1,
        QualityFilter: "AUTO"
      });
      const response = await rekognition.send(indexCommand);
      
      if (response.FaceRecords && response.FaceRecords.length > 0) {
        return NextResponse.json({ success: true, message: "Biometria da Mamãe Ivoni gravada com sucesso!" });
      } else {
        return NextResponse.json({ success: false, error: "Nenhum rosto claro encontrado na foto." }, { status: 400 });
      }
    } 
    
    if (action === 'recognize') {
      try {
        const searchCommand = new SearchFacesByImageCommand({
          CollectionId: COLLECTION_ID,
          Image: { Bytes: buffer },
          MaxFaces: 1,
          FaceMatchThreshold: 85
        });
        
        const response = await rekognition.send(searchCommand);
        
        if (response.FaceMatches && response.FaceMatches.length > 0) {
          const match = response.FaceMatches[0];
          if (match.Face?.ExternalImageId === "Mamae_Ivoni") {
            return NextResponse.json({ detected: true, person: "Mamãe Ivoni", confidence: match.Similarity });
          }
        }
        return NextResponse.json({ detected: false });
      } catch (searchError: any) {
        // Se a foto não tiver rosto nenhum, a AWS lança exceção. Nós ignoramos silenciosamente para não poluir o log.
        return NextResponse.json({ detected: false, noFace: true });
      }
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
    
  } catch (error: any) {
    console.error("[ATENA_VISION_ERROR]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

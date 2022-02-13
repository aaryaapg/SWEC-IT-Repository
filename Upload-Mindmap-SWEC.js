const PARENT_FOLDER_ID = "1MTz3Dz-9o_WpRAEgauNsJsfgPCLwgaBE";

const initialize = () => {
  const form = FormApp.getActiveForm();
  ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create();
};

function sendEmail(emailBody) {
  MailApp.sendEmail("info@mastersineurope.in", "New response for Mind Map Form", emailBody);
  MailApp.sendEmail("swecit-repository@mastersineurope.in", "New response for Mind Map Form", emailBody);
}

const onFormSubmit = ({ response } = {}) => {
  try {
    // Get some useful data to create the subfolder name
    const firstItemAnswer = response.getItemResponses()[0].getResponse() // text in first answer
    const subfolderName = firstItemAnswer + '-MindMap'
  
    // Get a list of all files uploaded with the response
    const files = response
      .getItemResponses()
      // We are only interested in File Upload type of questions
      .filter(
        (itemResponse) =>
          itemResponse.getItem().getType().toString() === "FILE_UPLOAD"
      )
      .map((itemResponse) => itemResponse.getResponse())
      // The response includes the file ids in an array that we can flatten
      .reduce((a, b) => [...a, ...b], []);

    if (files.length > 0) {
      // Each form response has a unique Id
      const parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
      const subfolder = parentFolder.createFolder(subfolderName);
      files.forEach((fileId) => {
        // Move each file into the custom folder
        DriveApp.getFileById(fileId).moveTo(subfolder);
      });
    }

    var emailBody = "New form response:\n\n";
    emailBody += firstItemAnswer + " has submitted the mind map. Please have a look!\n";
    emailBody += "Link: https://tinyurl.com/Folder-for-Mind-Maps \n\n";
    emailBody += "Regards,\n";
    emailBody += "SWEC\n";
    sendEmail(emailBody);

  } catch (f) {
    Logger.log(f);
  }
};
